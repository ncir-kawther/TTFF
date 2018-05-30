import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jmspipe'
})
export class JmspipePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
