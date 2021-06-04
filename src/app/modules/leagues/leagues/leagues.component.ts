// tslint:disable:no-string-literal
import { Component, OnInit } from '@angular/core';

import { LeaguesService } from '../_services/leagues.service';
import { League } from '../_models/leagues';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddTipicoCodeModalComponent } from './components/add-tipico-code/add-tipico-code-modal.component';
import { DeleteTipicoCodeModalComponent } from './components/delete-tipico-code/delete-tipico-code-modal.component';

@Component({
  selector: 'app-leagues',
  templateUrl: './leagues.component.html',
  styleUrls: ['./leagues.component.scss'],
})
export class LeaguesComponent implements OnInit {

  leagues: any[] = [];
  // countries: Country[];
  // sports: Sport[];
  result: any;
  selectedFile: File;
  showEdit = false;
  page = 1;
  leagueTemp: League;
  deactivate = 'disabled';

  search = '';
  total = 0;

  constructor(
    public _leaguesService: LeaguesService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.get(this.page, 'all');
  }

  get(page, search) {
    this.search = search;

    // const toast = swal.mixin({
    //   toast: true,
    //   position: 'top-end',
    //   showConfirmButton: false,
    //   timer: 20000
    // });

    // toast({
    //   type: 'info',
    //   title: 'Cargando ligas'
    // });

    this._leaguesService.get(page, search)
      .subscribe(resp => {
        this.leagues = resp.data;

        console.log(this.leagues);

        this.total = resp.total;

        console.log('total', this.total)
        this.page = resp.current_page;
        // swal.close();
        // localStorage.setItem('ligas', JSON.stringify(ligas.data));
      });
  }

  addTipicoCode(league: League) {
    const modalRef = this.modalService.open(AddTipicoCodeModalComponent);
    modalRef.componentInstance.league = league;

    modalRef.componentInstance.passEntry.subscribe((leagueEntry) => {
      this.leagues.find(x => x.id === leagueEntry.id).name_uk = leagueEntry.name_uk;
      modalRef.close();
    });    
  }

  deleteTipicoCode(league: League, code: String) {
    const modalRef = this.modalService.open(DeleteTipicoCodeModalComponent);
    modalRef.componentInstance.league = league;
    modalRef.componentInstance.code = code;

    modalRef.componentInstance.passEntry.subscribe((leagueEntry) => {
      this.leagues.find(x => x.id === leagueEntry.id).name_uk = leagueEntry.name_uk;
      modalRef.close();
    });    
  }
}
