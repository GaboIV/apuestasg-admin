import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  URL_COUNTRIES = environment.apiUrl + "/countries"

  constructor(
    private http: HttpClient,
    public _authService: AuthService,
  ) { }

  get() {
    let url = this.URL_COUNTRIES;

    return new Promise((resolve, reject) => {
      if (sessionStorage.getItem('countries')) {
        resolve(JSON.parse(sessionStorage.getItem('countries')));
      } else {

        this.http.get(url, this._authService.httpOptions)
          .subscribe((resp: any) => {
            sessionStorage.setItem('countries', JSON.stringify(resp.countries));
            resolve(resp.countries);
          }, error => reject("Error"));
      }
    });
  }
}
