import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { from, of, Subscription } from 'rxjs';
import { catchError, delay, finalize, first, tap } from 'rxjs/operators';
import { League } from '../../../_models/leagues';
import { LeaguesService } from '../../../_services/leagues.service';

@Component({
  selector: 'app-fetch-leagues-modal',
  templateUrl: './fetch-leagues-modal.component.html',
  styleUrls: ['./fetch-leagues-modal.component.scss']
})
export class FetchLeaguesModalComponent implements OnInit, OnDestroy {
  @Input() ids: number[];
  leagues: League[] = [];
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private leaguesService: LeaguesService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
    this.loadLeagues();
  }

  loadLeagues() {
    const sb = this.leaguesService.items$.pipe(
      first()
    ).subscribe((res: League[]) => {
      this.leagues = res;
    });
    this.subscriptions.push(sb);
  }

  fetchSelected() {
    this.isLoading = true;
    const sb = from([]).pipe( // fake => update to call request method from your server
      delay(1000), // Remove it from your code (just for showing loading)
      tap(() => {}),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(errorMessage);
      }),
      finalize(() => {
        this.isLoading = false;
        if (this.modal) {
          this.modal.close();
        }
      })
    ).subscribe();
    this.subscriptions.push(sb);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
