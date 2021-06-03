import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeaguePlatformComponent } from './leagues-platform.component';
import { LeagueEditComponent } from './leagues/league-edit/league-edit.component';
import { LeaguesComponent } from './leagues/leagues.component';

const routes: Routes = [
  {
    path: '',
    component: LeaguePlatformComponent,
    children: [
      {
        path: 'leagues',
        component: LeaguesComponent,
      },
      {
        path: 'league/add',
        component: LeagueEditComponent
      },
      {
        path: 'league/edit',
        component: LeagueEditComponent
      },
      {
        path: 'league/edit/:id',
        component: LeagueEditComponent
      },
      { path: '', redirectTo: 'leagues', pathMatch: 'full' },
      { path: '**', redirectTo: 'leagues', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeaguesRoutingModule {}
