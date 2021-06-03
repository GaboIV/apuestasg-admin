import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { League } from '../../../_models/leagues';
import { LeaguesService } from '../../../_services/leagues.service';

@Component({
  selector: 'app-add-tipico-code-modal',
  templateUrl: './add-tipico-code-modal.component.html',
  styleUrls: ['./add-tipico-code-modal.component.scss']
})
export class AddTipicoCodeModalComponent implements OnInit, OnDestroy {

  @Input() league: League;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  code: String = "";
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(
    private _leaguesService: LeaguesService,
    public modal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    console.log(this.league);
  }

  attachTipicoCode() {
    return this._leaguesService.attachTipicoCode(this.league, this.code)
      .subscribe((resp: any) => {
        this.returnData(resp.league);
      });
  }

  returnData(league: League) {
    this.passEntry.emit(league);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
