import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'riValue'
})
export class RiValuePipe implements PipeTransform {

  transform(value, ...args: unknown[]): unknown {
    if ((typeof value == 'string' && value.length) || (value == 0 && typeof value == 'number')) {
      return typeof value == 'string' ? value : this.parseValue(value)
    } else {
      return !value ? "N/A" : this.parseValue(value)
    }
  }

  parseValue(value) {
    return (Number.isInteger(value) ? value : value.toFixed(2))
  }

}
