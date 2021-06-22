import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BetTypeService {
  URL_BET_TYPES = environment.apiUrl + "/bet-types"

  constructor(
    private http: HttpClient,
    public _authService: AuthService,
  ) { }

  pagination(page: number, filters: Object) {
    let url = this.URL_BET_TYPES + '?page=' + page;

    Object.keys(filters).forEach(key => {
      if (filters[key] != '')
        url += "&" + key + "=" + filters[key];
    });

    return this.http.get(url, this._authService.httpOptions)
      .pipe(map((resp: any) => {
        return resp.bet_types;
      }));
  }

  updateValue(id, value, parameter) {
    const url = this.URL_BET_TYPES + '/' + id;
    
    var key = parameter;
    var obj = {};
    obj[key] = value;

    return this.http.put( url, obj, this._authService.httpOptions )
      .pipe(map( (resp: any) => {
        const res = resp;
        return res;
      })
    );
  }
}
