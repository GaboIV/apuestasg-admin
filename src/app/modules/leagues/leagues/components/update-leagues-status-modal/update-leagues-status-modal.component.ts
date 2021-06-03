import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, first, tap } from 'rxjs/operators';
import { League } from '../../../_models/leagues';
import { LeaguesService } from '../../../_services/leagues.service';

@Component({
  selector: 'app-update-leagues-status-modal',
  templateUrl: './update-leagues-status-modal.component.html',
  styleUrls: ['./update-leagues-status-modal.component.scss']
})
export class UpdateLeaguesStatusModalComponent implements OnInit, OnDestroy {
  @Input() ids: number[];
  status = 2;
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

  updateLeaguesStatus() {
    this.isLoading = true;
    const sb = this.leaguesService.updateStatusForItems(this.ids, +this.status).pipe(
      delay(1000), // Remove it from your code (just for showing loading)
      tap(() => this.modal.close()),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(undefined);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe();
    this.subscriptions.push(sb);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
