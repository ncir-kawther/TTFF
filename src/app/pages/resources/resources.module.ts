import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourcesComponent } from './resources.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { ToastyModule } from 'ng2-toasty';
export const ResourcesRoutes: Routes = [
  {
    path: '',
    component: ResourcesComponent,
    data: {
      breadcrumb: 'Default',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ResourcesRoutes),
    FormsModule, HttpClientModule,
    ToastyModule.forRoot()
  ],
  declarations: [ResourcesComponent]
})
export class ResourcesModule { }
