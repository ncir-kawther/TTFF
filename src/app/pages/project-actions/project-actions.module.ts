import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectActionsComponent } from './project-actions.component';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import {ChartModule} from 'angular2-chartjs';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {FocusModule} from 'angular2-focus';
import {ToastyModule} from 'ng2-toasty';

export const ProjectRoutes: Routes = [
  {
    path: '',
    component: ProjectActionsComponent,
    data: {
      breadcrumb: 'PROJECT ACTION',
      icon: 'icofont-home bg-c-blue',
      status: true
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ProjectRoutes),
    SharedModule,
    ChartModule,
    FormsModule, HttpClientModule,
    ToastyModule.forRoot()
  ],
  declarations: [ProjectActionsComponent]
})
export class ProjectActionsModule { }
