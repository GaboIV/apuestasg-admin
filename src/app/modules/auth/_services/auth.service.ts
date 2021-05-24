import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { UserModel } from '../_models/user.model';
import { AuthModel } from '../_models/auth.model';
import { AuthHTTPService } from './auth-http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  // public fields
  currentUser$: Observable<UserModel>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserModel>;
  isLoadingSubject: BehaviorSubject<boolean>;


  get currentUserValue(): UserModel {
    const url = environment.apiUrl + "/me";

    console.log(this.authLocalStorageToken);

    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMTljNjkxYmZhNzVmYjA3Y2VhMTk2NTQ1MDUyNmQxMmUwMTI1ZmJhMTI1NzU1N2E4N2YzYTgxNWMzMzZiYTRmMWJlOTg2NDA0YTA1ZjExMzQiLCJpYXQiOjE2MjE3Mjg2NzksIm5iZiI6MTYyMTcyODY3OSwiZXhwIjoxNjUzMjY0Njc5LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.F2yh8nmV_kjEXJW88G3bhWzjLprRtcHI_0ZNYz56R2WFB25Kw6SqfYu2wxsUQCKlui_3tAMOsUBcciUi9HEsrW3EiOM0xNH1iGcSyp4j1kdgBa23zLxKBOZvOtI8eWuckUG780JCyfj0NDb48cxsJ0vZOymSrkVhvTlUQghyC8zGzVtWW7iG2IyCzZRjkDG9PRx3oETl3QzJAokO52Lkg8FOm15RIdGw394fjXNCMv4ZPftrbxc--xMNb5BQ8Fl97BajNpmE-GS0_xrV8w_QKiu3PBNVHzISPYPSLEHaDPqFjoSunrm7sGXTE00ruH-w2E6HxsibeCU0vaoUPYf4yhHjcw5xMF0qK3_tv7wBjig5HoRu9R6NZedqd2iAB4BGsd9JxWLIYblNWYcSkaKFvI5ikY6sWBblBs7ONHauckBhgXspYfG_Q4I8WjkIcRTMV_RtkhJcYODPL76BsBJdJBAz67r0vIqYGucLqJZIvpicukcUqzkYxdSoDFz8Aa8iQvDK0p8G0rZ_SZY8WWL1-L425aSEj3QFAe2BTLiSgC01zSAplwnF9TGHDMkkMJZhqmh3pHMGEs3_4WUNSx9uToWimixV2tkTV2qurPGBWEBvz7vrvkuIyxynKkuhXT3mz-zFHoScXvDMv6FnfieYcKrcUTo865ELrVRwgftbrKU'
      })
    };

    let user = this.http.get( url, this.httpOptions )
      .pipe(map ( (resp: any) => {
        return resp;
      }));

    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserModel) {
    this.currentUserSubject.next(user);
  }

  constructor(
    private authHttpService: AuthHTTPService,    
    private http: HttpClient,
    private router: Router
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserModel>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    const subscr = this.getUserByToken().subscribe();
    this.unsubscribe.push(subscr);
  }

  // public methods
  login(email: string, password: string): Observable<UserModel> {
    this.isLoadingSubject.next(true);

    const url = environment.apiUrl + "/auth/login";

    let userLogin = null;

    if ( email !== undefined && password != '' ) {
      return this.http.post(url, {
        "email" : email,
        "password" : password
      }, this.httpOptions).pipe(
        map((resp: any) => {
          this.currentUserValue = resp.user;

          const auth = new AuthModel();
          auth.accessToken = resp.access_token;

          const result = this.setAuthFromLocalStorage(auth);
          
          return resp.user;
        }),
        switchMap(() => this.getUserByToken()),
        catchError((err) => {
          console.error('err', err);
          return of(undefined);
        }),
        finalize(() => this.isLoadingSubject.next(false))
      );
    }    
  }

  logout() {
    localStorage.removeItem(this.authLocalStorageToken);
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  getUserByToken(): Observable<UserModel> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.accessToken) {
      return of(undefined);
    }

    const url = environment.apiUrl + "/me";

    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMTljNjkxYmZhNzVmYjA3Y2VhMTk2NTQ1MDUyNmQxMmUwMTI1ZmJhMTI1NzU1N2E4N2YzYTgxNWMzMzZiYTRmMWJlOTg2NDA0YTA1ZjExMzQiLCJpYXQiOjE2MjE3Mjg2NzksIm5iZiI6MTYyMTcyODY3OSwiZXhwIjoxNjUzMjY0Njc5LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.F2yh8nmV_kjEXJW88G3bhWzjLprRtcHI_0ZNYz56R2WFB25Kw6SqfYu2wxsUQCKlui_3tAMOsUBcciUi9HEsrW3EiOM0xNH1iGcSyp4j1kdgBa23zLxKBOZvOtI8eWuckUG780JCyfj0NDb48cxsJ0vZOymSrkVhvTlUQghyC8zGzVtWW7iG2IyCzZRjkDG9PRx3oETl3QzJAokO52Lkg8FOm15RIdGw394fjXNCMv4ZPftrbxc--xMNb5BQ8Fl97BajNpmE-GS0_xrV8w_QKiu3PBNVHzISPYPSLEHaDPqFjoSunrm7sGXTE00ruH-w2E6HxsibeCU0vaoUPYf4yhHjcw5xMF0qK3_tv7wBjig5HoRu9R6NZedqd2iAB4BGsd9JxWLIYblNWYcSkaKFvI5ikY6sWBblBs7ONHauckBhgXspYfG_Q4I8WjkIcRTMV_RtkhJcYODPL76BsBJdJBAz67r0vIqYGucLqJZIvpicukcUqzkYxdSoDFz8Aa8iQvDK0p8G0rZ_SZY8WWL1-L425aSEj3QFAe2BTLiSgC01zSAplwnF9TGHDMkkMJZhqmh3pHMGEs3_4WUNSx9uToWimixV2tkTV2qurPGBWEBvz7vrvkuIyxynKkuhXT3mz-zFHoScXvDMv6FnfieYcKrcUTo865ELrVRwgftbrKU'
      })
    };

    this.isLoadingSubject.next(true);    

    return this.http.get( url, this.httpOptions ).pipe(
      map((user: UserModel) => {
        if (user) {
          this.currentUserSubject = new BehaviorSubject<UserModel>(user);
        } else {
          this.logout();
        }
        return user;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  // need create new user then login
  registration(user: UserModel): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.createUser(user).pipe(
      map(() => {
        this.isLoadingSubject.next(false);
      }),
      switchMap(() => this.login(user.email, user.password)),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  forgotPassword(email: string): Observable<boolean> {
    this.isLoadingSubject.next(true);
    return this.authHttpService
      .forgotPassword(email)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  // private methods
  private setAuthFromLocalStorage(auth: AuthModel): boolean {
    // store auth accessToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (auth && auth.accessToken) {
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
      return true;
    }
    return false;
  }

  private getAuthFromLocalStorage(): AuthModel {
    try {
      const authData = JSON.parse(
        localStorage.getItem(this.authLocalStorageToken)
      );
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
