import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IndexConstants } from '../index-constants';
import { ToggleItem } from '../index-interface';
import { ClimatePrice } from 'app/climate-price/climate-price.utils';
import { ClimatePriceService } from 'app/shared/services/climate-price.service';

@Component({
  selector: 'app-time-period-toggle',
  templateUrl: './time-period-toggle.component.html',
  styleUrls: ['../location-impact/location-impact.component.scss']
})
export class TimePeriodToggleComponent {

  @Output() ToggleSelection = new EventEmitter<ToggleItem>()
  @Input() selectedToggleItem: ToggleItem = IndexConstants.DefaultTimePeriod;

  toggleList: ToggleItem[] = IndexConstants.riskTimePeriods
  isComparisonComponent: boolean = ClimatePrice.isComarisonComponent()

  constructor(private _climatePriceService: ClimatePriceService) { }

  onTimePeriodToggle(toggleDirection?) {
    const selectedItemIdx = this.toggleList.findIndex(_ => _.key == this.selectedToggleItem.key)
    switch (toggleDirection) {
      case "right":
        this.selectedToggleItem = this.toggleList[selectedItemIdx + 1]
        break;
      case "left":
        this.selectedToggleItem = this.toggleList[selectedItemIdx - 1]
        break;
    }
    if (this.isComparisonComponent) this._climatePriceService.selectedTimePeriod = this.selectedToggleItem

    this.ToggleSelection.emit(this.selectedToggleItem)
  }

  setTimePeriodAndEmitEvent(timePeriodKeyName) {
    this.selectedToggleItem = this.toggleList.find(_ => _.key == timePeriodKeyName)
    this.ToggleSelection.emit(this.selectedToggleItem)
  }

}
