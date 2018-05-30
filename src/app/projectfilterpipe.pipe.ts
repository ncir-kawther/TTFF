import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'projectfilterpipe',
  pure: false
})
export class ProjectfilterpipePipe implements PipeTransform {

  transform(items: any[], projectfilter: string): any {

    // tslint:disable-next-line:prefer-const
    let items2: any[];
    items2 = [];
    for (const elt of items) {
      if (elt.projectName.includes(projectfilter)) {
items2.push(elt);
      }
    }
      return items2;
  }



}
