import { Inject, Injectable } from '@angular/core';
import { TableService } from '../../../_metronic/shared/crud-table';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { League } from '../_models/leagues';
import { AuthService } from '../../auth';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LeaguesService {
  URL_LEAGUES = environment.apiUrl + "/leagues"

  constructor(
    private http: HttpClient,
    public _authService: AuthService,
  ) { }

  get(page: number, search: string) {
    let url = "";

    if (search !== null) {
      url = this.URL_LEAGUES + '?page=' + page + '&search=' + search;
    } else {
      url = this.URL_LEAGUES + '?page=' + page;
    }

    return this.http.get(url, this._authService.httpOptions)
      .pipe(map((resp: any) => {
        return resp.leagues;
      }));
  }

  attachTipicoCode(league: League, code: String) {
    const url = this.URL_LEAGUES + "/" + league.id + "/attach";

    return this.http.patch( url, { name_uk: code }, this._authService.httpOptions  )
    .pipe(map ( (resp: any) => {
      return resp;
    }));
  }
}
