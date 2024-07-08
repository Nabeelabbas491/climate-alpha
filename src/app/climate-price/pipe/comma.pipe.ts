import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'FormatByComma'
})
export class CommaPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 'N/A';
  }

}
