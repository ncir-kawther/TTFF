import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestCasesComponent } from './test-cases.component';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import {ChartModule} from 'angular2-chartjs';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {FocusModule} from 'angular2-focus';
import {ToastyModule} from 'ng2-toasty';
import {DataTableModule} from 'angular2-datatable';
import {AngularEchartsModule} from 'ngx-echarts';

export const TestCasesRoutes: Routes = [
  {
    path: '',
    component: TestCasesComponent,
    data: {
      breadcrumb: 'PROJECT ACTION',
      icon: 'icofont-home bg-c-blue',
      status: true
    }
  }
];

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TestCasesComponent]
})
export class TestCasesModule { }
