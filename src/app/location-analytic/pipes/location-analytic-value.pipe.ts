import { Pipe, PipeTransform } from '@angular/core';
import { RiValuePipe } from 'app/index/pipes/ri-value.pipe';

@Pipe({
  name: 'laValue'
})
export class LaValuePipe extends RiValuePipe implements PipeTransform { }
