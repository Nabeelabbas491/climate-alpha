import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BenhmarkDropdownComponent } from '../benhmark-dropdown/benhmark-dropdown.component';
import { LocationImpactComponent } from '../location-impact/location-impact/location-impact.component';
import { Benchmark, Impact, ImpactType, LocationImpact, ScoreType, ToggleItem } from '../index-interface';
import { ScenariosComponent } from '../scenarios/scenarios.component';
import { ClimatePrice } from 'app/climate-price/climate-price.utils';
import { RiskScoreComponent } from '../risk-score/risk-score.component';
import { ClimatePriceService } from 'app/shared/services/climate-price.service';
@Component({
  selector: 'app-global-overview',
  templateUrl: './global-overview.component.html',
  styleUrls: ['./global-overview.component.scss']
})
export class GlobalOverviewComponent {

  @ViewChild(LocationImpactComponent) locationImpactComponent: LocationImpactComponent
  @ViewChild(BenhmarkDropdownComponent) dropdown: BenhmarkDropdownComponent
  @ViewChild(ScenariosComponent) scenariosCompoent: ScenariosComponent

  @Output() ScenarioSelection = new EventEmitter<string>()

  @Input() allowUserInput: boolean = true

  response

  constructor(private _climatePriceService: ClimatePriceService) { }

  loadOverview = (response) => (this.response = response, this.dropdown.setBenchMarkDropdown(response.benchMark))

  onBenchMarkSelection = (event) => this.locationImpactComponent.loadLocationImpact({ ...this.response, selectedBenchMark: event })

  setComparisonConfigurations(data) {
    this.scenariosCompoent.selectedScenario = this._climatePriceService.selectedScenario || data.scenario
    this.response = data.propertyData[this._climatePriceService.selectedScenario?.value || data.scenario?.value]
    this.locationImpactComponent.setComparisonConfigurations(data)
    this.dropdown.setBenchMarkDropdown(this.response.benchMark, this._climatePriceService.selectedBenchMark || data.benchmark)
  }

  removeScore = () => (this.response = undefined, this.locationImpactComponent.removeData())

}

