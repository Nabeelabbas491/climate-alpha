import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ranking-bars',
  templateUrl: './ranking-bars.component.html',
  styleUrls: ['./ranking-bars.component.scss']
})
export class RankingBarsComponent implements OnInit {

  @Input() title = ''
  @Input() showTitle = true
  @Input() subTitle = ''
  @Input() showSubTitle = true
  @Input() showValue: boolean = true
  @Input() showCount: boolean = true
  barsListing = []

  constructor() { }

  ngOnInit(): void {
  }

  setBars(data, key, title, color) {

    if (!data.length) return;

    if (data.length === 1) {
      data = data.map((item) => {
        return { ...item, width: '100%', value: item[key], bgColor: item[color], name: item[title] }
      })
    } else {
      let filterKeyvalues = []
      data?.forEach((item, i) => {
        filterKeyvalues.push(parseInt(parseFloat(item[key]).toFixed(0)));
      });

      let minimumValue = Math.min.apply(Math, filterKeyvalues)
      let maximumValue = Math.max.apply(Math, filterKeyvalues)

      data = data.map((item) => {
        let prograssBarPercentage = this.mapOneRangeToAnother(item[key], minimumValue, maximumValue, 1, 100)
        return { ...item, width: prograssBarPercentage, value: item[key], bgColor: item[color], name: item[title] }
      })
    }

    this.barsListing = data

  }

  mapOneRangeToAnother(value, in_min, in_max, out_min, out_max) {
    let val = (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    if (val < out_min) val = out_min;
    else if (val > out_max) val = out_max;
    return `${Math.trunc(val)}%`;
  }

}
