import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { League } from '../../_models/leagues';
import { LeaguesService } from '../../_services/leagues.service';

const EMPTY_LEAGUE: League = {
  id: undefined,
  name: 'Nombre de liga',
  category_id: 1,
  country_id: 1,
  match_structure_id: 4,
  status: true
};

@Component({
  selector: 'app-league-edit',
  templateUrl: './league-edit.component.html',
  styleUrls: ['./league-edit.component.scss']
})
export class LeagueEditComponent implements OnInit, OnDestroy {
  id: number;
  league: League;
  previous: League;
  formGroup: FormGroup;
  isLoading$: Observable<boolean>;
  errorMessage = '';
  tabs = {
    BASIC_TAB: 0,
    REMARKS_TAB: 1,
    SPECIFICATIONS_TAB: 2
  };
  activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Remarks | 2 => Specifications
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private leaguesService: LeaguesService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // this.isLoading$ = this.leaguesService.isLoading$;
    this.loadProduct();
  }

  loadProduct() {
    const sb = this.route.paramMap.pipe(
      switchMap(params => {
        // get id from URL
        this.id = Number(params.get('id'));
        if (this.id || this.id > 0) {
          // return this.leaguesService.getItemById(this.id);
        }
        return of(EMPTY_LEAGUE);
      }),
      catchError((errorMessage) => {
        this.errorMessage = errorMessage;
        return of(undefined);
      }),
    ).subscribe((res: League) => {
      if (!res) {
        this.router.navigate(['/products'], { relativeTo: this.route });
      }

      this.league = res;
      this.previous = Object.assign({}, res);
      this.loadForm();
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    if (!this.league) {
      return;
    }

    this.formGroup = this.fb.group({
      name: [this.league.name, Validators.required],
      category_id: [this.league.category_id, Validators.required],
      country_id: [this.league.country_id, Validators.required],
      match_structure_id: [this.league.match_structure_id, Validators.required],
      status: [this.league.status, Validators.required],
    });
  }

  reset() {
    if (!this.previous) {
      return;
    }

    this.league = Object.assign({}, this.previous);
    this.loadForm();
  }

  save() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) {
      return;
    }

    const formValues = this.formGroup.value;
    this.league = Object.assign(this.league, formValues);
    if (this.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    
  }

  create() {
      
  }

  changeTab(tabId: number) {
    this.activeTabId = tabId;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string) {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }
}
