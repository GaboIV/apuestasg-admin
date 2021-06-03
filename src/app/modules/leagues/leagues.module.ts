import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LeaguesComponent } from './leagues/leagues.component';
import { LeaguePlatformComponent } from './leagues-platform.component';
import { LeaguesRoutingModule } from './leagues-routing.module';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AddTipicoCodeModalComponent } from './leagues/components/add-tipico-code/add-tipico-code-modal.component';

@NgModule({
  declarations: [
    LeaguesComponent,
    LeaguePlatformComponent,
    // Modals
    AddTipicoCodeModalComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    LeaguesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    CRUDTableModule,
    NgbModalModule,
    NgbDatepickerModule
  ],
  entryComponents: [
    // Modals
    AddTipicoCodeModalComponent
  ]
})
export class LeaguesModule {}
