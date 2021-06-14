import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesPlatformComponent } from './categories-platform.component';
import { CategoriesComponent } from './table/categories.component';
import { NewEditCategoryModalComponent } from './components/new-edit-category-modal/new-edit-category-modal.component';

@NgModule({
  declarations: [
    CategoriesComponent,
    CategoriesPlatformComponent,
    // Modals
    NewEditCategoryModalComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    CategoriesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    CRUDTableModule,
    NgbModalModule,
    NgbDatepickerModule,
    NgbModule
  ],
  entryComponents: [
    // Modals
    NewEditCategoryModalComponent
  ]
})
export class CategoriesModule {}
