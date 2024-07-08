import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { IndexConstants } from '../../../index/index-constants';
import { BenchMarkParamType, ImpactType, IndicatorColor, ScoreType, SelectedBenchMarkEvent, ToggleItem } from '../../../index/index-interface';
import { BenhmarkDropdownComponent } from '../../../index/benhmark-dropdown/benhmark-dropdown.component';
import { LocationBenchmarkComponent } from '../../../index/location-benchmark/location-benchmark.component';
import { ClimatePriceService } from 'app/shared/services/climate-price.service';
import { ScenariosComponent } from '../../../index/scenarios/scenarios.component';
import { ClimatePrice } from 'app/climate-price/climate-price.utils';

@Component({
  selector: 'app-multi-asset-overview',
  templateUrl: './multi-asset-overview.component.html',
  styleUrls: ['./multi-asset-overview.component.scss']
})
export class MultiAssetOverviewComponent implements OnInit {

  @ViewChild(ScenariosComponent) scenariosCompoent: ScenariosComponent
  @ViewChild(BenhmarkDropdownComponent) dropdown: BenhmarkDropdownComponent
  @ViewChild('physicalImpactRef') physicalImpactBenchMark: LocationBenchmarkComponent
  @ViewChild('resAdjImpactRef') resAdjImpactBenchMark: LocationBenchmarkComponent
  @Output() ScenarioSelection = new EventEmitter<string | number>();
  @Output() ApiSubscribed = new EventEmitter();
  @Output() TimePeriodSelection = new EventEmitter<ToggleItem>()
  @Output() ScoreTypeSelection = new EventEmitter<any>()
  isApiSusbcribed: Boolean;
  riskColors: IndicatorColor = IndexConstants.riskColors
  resiColors: IndicatorColor = IndexConstants.resiColors
  selectedScenario = IndexConstants.DefaultScenario
  isComparisonComponent: boolean = ClimatePrice.isComarisonComponent()
  response: any;

  async ngOnInit(): Promise<void> { !this.isComparisonComponent && await this.getData() }

  constructor(private _climatePriceService: ClimatePriceService) { }

  async getData() {
    try {
      this.isApiSusbcribed = false
      this.response = await this._climatePriceService.getGlobalOverview(this.selectedScenario)
      const params: BenchMarkParamType = { impact_type: 'all', benchmark_type: 'static', scenario: this.selectedScenario }
      const response: any = await this._climatePriceService.getRiskBenchMark(params)
      this.dropdown.setBenchMarkDropdown(response)
      this.ApiSubscribed.emit()
      this.isApiSusbcribed = true
    } catch (e) {
      console.log(e)
      this.isApiSusbcribed = true
      this.ApiSubscribed.emit()
    }
  }

  onBenchMarkChange(event: SelectedBenchMarkEvent) {
    this.physicalImpactBenchMark.updateComponent({ data: this.risk, benchmark: event.risk })
    this.resAdjImpactBenchMark.updateComponent({ data: this.resilience, benchmark: event.resilience })
  }

  onScenarioChange(event) {
    this.selectedScenario = event
    this.getData();
    this.ScenarioSelection.emit(event)
  }

  // dont repeat this in future , if comes a scenario where needed to be repeat handle through observables in their own corresponding components
  onTimePeriodSelection(type: ImpactType, selectedTimePeriod: ToggleItem) {
    switch (type) {
      case 'Physical Impact':
        if (this.response?.res_adj_impact) this.resAdjImpactBenchMark.timePeriodToggleComponent.selectedToggleItem = selectedTimePeriod
      case 'Resilience-Adjusted Impact':
        if (this.response?.physical_impact) this.physicalImpactBenchMark.timePeriodToggleComponent.selectedToggleItem = selectedTimePeriod
        break;
    }
    this.updateMarkerSliders()
    this.TimePeriodSelection.emit(selectedTimePeriod)
  }

  updateMarkerSliders() {
    this.physicalImpactBenchMark.updateComponent({ data: this.risk })
    this.response?.res_adj_impact && this.resAdjImpactBenchMark.updateComponent({ data: this.resilience })
  }

  onScoreTypeSelection(type: ImpactType, selectedScoreType: ScoreType) {
    switch (type) {
      case 'Physical Impact':
        if (this.response?.res_adj_impact) this.resAdjImpactBenchMark.scoreToggleComponent.selectedScoreType = selectedScoreType
      case 'Resilience-Adjusted Impact':
        if (this.response?.physical_impact) this.physicalImpactBenchMark.scoreToggleComponent.selectedScoreType = selectedScoreType
        break;
    }
    this.updateMarkerSliders()
    this.ScoreTypeSelection.emit(selectedScoreType)
  }

  get risk() {
    const selectedScoreType = this.physicalImpactBenchMark?.scoreToggleComponent.selectedScoreType
    const selectedTimePeriod = this.physicalImpactBenchMark?.timePeriodToggleComponent.selectedToggleItem.key
    return {
      value: this.response?.physical_impact?.Headline[selectedScoreType][selectedTimePeriod],
      cat: this.response?.physical_impact?.Headline.Cat[selectedTimePeriod]
    }
  }

  get resilience() {
    const selectedScoreType = this.resAdjImpactBenchMark?.scoreToggleComponent.selectedScoreType
    const selectedTimePeriod = this.resAdjImpactBenchMark?.timePeriodToggleComponent.selectedToggleItem.key
    return {
      value: this.response?.res_adj_impact?.Headline[selectedScoreType][selectedTimePeriod],
      cat: this.response?.res_adj_impact?.Headline.Cat[selectedTimePeriod]
    }
  }

  setComparisonConfigurations(comparison) {
    // component variables update
    this.response = comparison.overviewData
    this.selectedScenario = this._climatePriceService?.selectedScenario?.value || comparison.scenario?.value
    // scenario component , setting selected scenario
    this.scenariosCompoent.selectedScenario = this._climatePriceService.selectedScenario || comparison.scenario
    //  benchmarks
    this.dropdown.setBenchMarkDropdown(comparison.benchMarkData, this._climatePriceService.selectedBenchMark || comparison?.benchmark)
    // physical Impact
    this.physicalImpactBenchMark.scoreToggleComponent.selectedScoreType = this._climatePriceService.selectedScoreType || comparison.selectedScoreType
    this.physicalImpactBenchMark.timePeriodToggleComponent.selectedToggleItem = this._climatePriceService.selectedTimePeriod || comparison.selectedTimePeriod
    // res adj Impact BenchMark 
    this.resAdjImpactBenchMark.scoreToggleComponent.selectedScoreType = this._climatePriceService.selectedScoreType || comparison.selectedScoreType
    this.resAdjImpactBenchMark.timePeriodToggleComponent.selectedToggleItem = this._climatePriceService.selectedTimePeriod || comparison.selectedTimePeriod
  }
}

