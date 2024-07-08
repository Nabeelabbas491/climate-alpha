import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'resilience'
})
export class ResiliencePipe implements PipeTransform {

  transform(value: unknown, scenario: any): unknown {
    console.log("value..", value, "args", scenario)
    return "Da"
  }

}
