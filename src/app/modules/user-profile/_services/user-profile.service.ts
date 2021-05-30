import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../auth';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) { }
 
  updatePersonalInformation(data: any) {
    const url = environment.apiUrl + '/me/personal-information';

    console.log(url, data);

    return this.http.put(url, data, this.authService.httpOptions)
      .pipe(map( (resp: any) => {
        const res = resp;
        console.log(res);
        return res;
      })
    );
  }
}
