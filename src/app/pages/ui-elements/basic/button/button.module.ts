import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button.component';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../../../shared/shared.module';
import { SchemaFormModule, WidgetRegistry, DefaultWidgetRegistry } from 'angular2-schema-form';


export const ButtonRoutes: Routes = [
  {
    path: '',
    component: ButtonComponent,
    data: {
      breadcrumb: 'Button',
      icon: 'icofont-layout bg-c-blue',
      status: true
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    SchemaFormModule.forRoot(),
    RouterModule.forChild(ButtonRoutes),
    SharedModule
  ],
  declarations: [ButtonComponent],
  providers: [{provide: WidgetRegistry, useClass: DefaultWidgetRegistry}]
})
export class ButtonModule { }
