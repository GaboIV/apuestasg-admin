import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriesPlatformComponent } from './categories-platform.component';
import { CategoriesComponent } from './table/categories.component';

const routes: Routes = [
  {
    path: '',
    component: CategoriesPlatformComponent,
    children: [
      {
        path: 'table',
        component: CategoriesComponent,
      },
      { path: '', redirectTo: 'table', pathMatch: 'full' },
      { path: '**', redirectTo: 'table', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriesRoutingModule {}
