import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClimatePrice } from 'app/climate-price/climate-price.utils';
import { IndexConstants } from '../index-constants';
import { ClimatePriceService } from 'app/shared/services/climate-price.service';

@Component({
  selector: 'app-scenarios',
  templateUrl: './scenarios.component.html',
  styleUrls: ['./scenarios.component.scss']
})
export class ScenariosComponent {

  @Output() ScenarioSelection = new EventEmitter<string | number>();
  @Input() containerClass = 'card'
  scenarios = IndexConstants.Scenarios
  selectedScenario = IndexConstants.Scenarios[1]
  isComparisonComponent: boolean = ClimatePrice.isComarisonComponent()

  constructor(private _climatePriceService: ClimatePriceService) { }

  onScenarioSelection(item) {
    if (item.showSpinner) return;
    this.selectedScenario = item
    if (this.isComparisonComponent) this._climatePriceService.selectedScenario = this.selectedScenario
    this.ScenarioSelection.next(item.value)
  }

  toggleSpinnerForScenarios(loadedScenariosList: Array<string>) {
    this.scenarios = this.scenarios.map(m => { return { ...m, showSpinner: !loadedScenariosList.includes(m.value) } })
  }

}
