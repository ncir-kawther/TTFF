import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimplePageComponent } from './simple-page.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { ToastyModule } from 'ng2-toasty';
export const SimplePageRoutes: Routes = [{
  path: '',
  component: SimplePageComponent,
  data: {
    breadcrumb: 'Uploaded projects',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(SimplePageRoutes),
    HttpClientModule,
    SharedModule,
    ToastyModule.forRoot()
  ],
  declarations: [SimplePageComponent]
})
export class SimplePageModule { }
