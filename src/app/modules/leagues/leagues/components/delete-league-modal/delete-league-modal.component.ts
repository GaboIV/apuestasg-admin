import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { LeaguesService } from '../../../_services/leagues.service';

@Component({
  selector: 'app-delete-league-modal',
  templateUrl: './delete-league-modal.component.html',
  styleUrls: ['./delete-league-modal.component.scss']
})
export class DeleteLeagueModalComponent implements OnInit, OnDestroy {

  @Input() id: number;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private leaguesService: LeaguesService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteLeague() {
    this.isLoading = true;
    const sb = this.leaguesService.delete(this.id).pipe(
      delay(1000), // Remove it from your code (just for showing loading)
      tap(() => this.modal.close()),
      catchError((err) => {
        this.modal.dismiss(err);
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
