import { NgModule,NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExposeSoapComponent } from './expose-soap.component';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import {ChartModule} from 'angular2-chartjs';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {FocusModule} from 'angular2-focus';
// import {SelectModule} from 'ng2-select';
// import { MDBBootstrapModule } from 'angular-bootstrap-md';
import {ToastyModule} from 'ng2-toasty';

export const ExposeSoapRoutes: Routes = [
  {
    path: '',
    component: ExposeSoapComponent,
    data: {
      breadcrumb: 'EXPOSE SOAP',
      icon: 'icofont-home bg-c-blue',
      status: true
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ExposeSoapRoutes),
    SharedModule,
    ChartModule,
    FormsModule, HttpClientModule, ToastyModule.forRoot()
  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  declarations: [ExposeSoapComponent]
})
export class ExposeSoapModule { }
