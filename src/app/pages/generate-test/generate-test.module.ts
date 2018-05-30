import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenerateTestComponent } from './generate-test.component';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import {ChartModule} from 'angular2-chartjs';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {FocusModule} from 'angular2-focus';
import {DataTableModule} from 'angular2-datatable';
import {AngularEchartsModule} from 'ngx-echarts';
import {ToastyModule} from 'ng2-toasty';



export const GenerateTestRoutes: Routes = [
  {
    path: '',
    component: GenerateTestComponent,
    data: {
      breadcrumb: 'Generate Test Project',
      icon: 'icofont-home bg-c-blue',
      status: true
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(GenerateTestRoutes),
    SharedModule,
    ChartModule,
    FormsModule, HttpClientModule,
  //
    ToastyModule.forRoot()
  ],
  declarations: [GenerateTestComponent]
})
export class GenerateTestModule { }
