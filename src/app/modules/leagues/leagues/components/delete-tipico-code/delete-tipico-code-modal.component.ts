import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { League } from '../../../_models/leagues';
import { LeaguesService } from '../../../_services/leagues.service';

@Component({
  selector: 'app-delete-tipico-code-modal',
  templateUrl: './delete-tipico-code-modal.component.html',
  styleUrls: ['./delete-tipico-code-modal.component.scss']
})
export class DeleteTipicoCodeModalComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('input1', {static: false}) inputEl: ElementRef;

  @Input() league: League;
  @Input() code: String;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(
    private renderer: Renderer2,
    private _leaguesService: LeaguesService,
    public modal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    setTimeout(() => this.inputEl.nativeElement.focus());
  }

  dettachTipicoCode() {
    this.isLoading = true;

    return this._leaguesService.dettachTipicoCode(this.league, this.code)
      .subscribe((resp: any) => {
        this.isLoading = false;
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
