import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { LeaguesService } from '../../../_services/leagues.service';

@Component({
  selector: 'app-delete-leagues-modal',
  templateUrl: './delete-leagues-modal.component.html',
  styleUrls: ['./delete-leagues-modal.component.scss']
})
export class DeleteLeaguesModalComponent implements OnInit, OnDestroy {
  @Input() ids: number[];
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private leaguesService: LeaguesService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteLeagues() {
    this.isLoading = true;
    const sb = this.leaguesService.deleteItems(this.ids).pipe(
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
