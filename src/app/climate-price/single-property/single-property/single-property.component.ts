import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ClimatePrice } from 'app/climate-price/climate-price.utils';
import { ClimatePriceService } from 'app/shared/services/climate-price.service';
import { SinglpePropertyMapComponent } from '../singlpe-property-map/singlpe-property-map.component';
import { ClimatePriceHeaderComponent } from 'app/climate-price/climate-price-header/climate-price-header.component';
import { Messages } from 'app/shared/data/messages';
import { GlobalOverviewComponent } from 'app/index/global-overview/global-overview.component';
import { AppConstants } from 'app/shared/data/constants';
import { ClimateAlphaService } from 'app/shared/services/climatealpha.service';
import { IndexConstants } from 'app/index/index-constants';
import { AuthService } from 'app/shared/services/auth.service';
@Component({
  selector: 'app-single-property',
  templateUrl: './single-property.component.html',
  styleUrls: ['./single-property.component.scss']
})
export class SinglePropertyComponent implements OnInit, OnDestroy {

  @ViewChild(SinglpePropertyMapComponent) singlpePropertyMapComponent: SinglpePropertyMapComponent
  @ViewChild(ClimatePriceHeaderComponent) climatePriceHeaderComponent: ClimatePriceHeaderComponent
  @ViewChild(GlobalOverviewComponent) globalOverviewComponent: GlobalOverviewComponent
  isComparisonComponent: boolean = ClimatePrice.isComarisonComponent()
  showDataProcessingMessage: boolean = false
  dataMessage: string = Messages.SUMMARY;
  assetId: string;
  propertyData;

  constructor(private _climatePriceService: ClimatePriceService,
    private _climateAlphaService: ClimateAlphaService,
    private _authService: AuthService,
    private _cdr: ChangeDetectorRef) {
  }

  async ngOnInit(): Promise<void> { }

  async loadSingleAsset(id) {
    this.propertyData = Object.assign({})
    this.assetId = id
    this._cdr.detectChanges()
    if (this.assetId) {
      this.globalOverviewComponent.removeScore()
      const selectedScenario = this.globalOverviewComponent.scenariosCompoent.selectedScenario.value
      this.singlpePropertyMapComponent.apiCallInProgress = true
      await this.getPropertyData(selectedScenario)
      this.loadSelectedScenarioScore(selectedScenario)
      this.globalOverviewComponent.scenariosCompoent.toggleSpinnerForScenarios(Object.keys(this.propertyData))
      this.setPdfFilters()
      await this.getOtherScenariosData(selectedScenario)
      this.singlpePropertyMapComponent.apiCallInProgress = false
    }
  }

  async getOtherScenariosData(selectedScenario) {
    const otherScenarios = IndexConstants.Scenarios.filter(x => x.value != selectedScenario)
    for (let i = 0; i < otherScenarios.length; i++) {
      await this.getPropertyData(otherScenarios[i].value)
      this.globalOverviewComponent.scenariosCompoent.toggleSpinnerForScenarios(Object.keys(this.propertyData))
    }
  }

  async getPropertyData(selectedScenario) {
    const selectedProperty = this.singlpePropertyMapComponent.selectedProperty
    const benchMarkBody = IndexConstants.getBenchMarkParams({ h306: selectedProperty.h3_06, scenario: selectedScenario })
    const [risk, resilience, benchMark] = await Promise.all([
      this._climatePriceService.getRiskData(this.assetId, selectedScenario),
      this._climatePriceService.getResilienceRiskData(this.assetId, selectedScenario),
      this._climatePriceService.getRiskBenchMark(benchMarkBody),
    ])

    this.propertyData[selectedScenario] = { risk: risk, resilience: resilience, benchMark: benchMark }
  }

  async loadSelectedScenarioScore(selectedScenario) {
    this.globalOverviewComponent.loadOverview(this.propertyData[selectedScenario])
    !this.isComparisonComponent && this.setPdfFilters()
  }

  onYearChange(): void { }

  onBenchmarkChange() { }

  addToComparison() {
    if (this.singlpePropertyMapComponent.apiCallInProgress) return;
    let address = this.singlpePropertyMapComponent.selectedProperty.location
    address = address.length > 15 ? `${address.slice(0, 15)}...` : address
    let data: { [key: string]: Object | number | string } = {
      type: 'Single-Asset',
      assetId: this.assetId,
      id: AppConstants.uniqueId,
      address: address,
      mapData: this.singlpePropertyMapComponent.properties,
      selectedIndicator: this.globalOverviewComponent.locationImpactComponent.selectedIndicator,
      selectedTab: this.globalOverviewComponent.locationImpactComponent.selectedTab,
      selectedScoreType: this.globalOverviewComponent.locationImpactComponent.selectedScoreType,
      selectedTimePeriod: this.globalOverviewComponent.locationImpactComponent.selectedToggleItem,
      scenario: this.globalOverviewComponent.scenariosCompoent.selectedScenario,
      benchmark: this.globalOverviewComponent.dropdown.selectedBenchmark,
      propertyData: this.propertyData
    }
    let list = this._climatePriceService.getComparisonList() ?? []
    list.push(data)
    this.climatePriceHeaderComponent.comparisonCount = list.length
    this._climatePriceService.saveInLocalStorage(list)
  }

  loadFilteredComparison(data) {
    this.assetId = data.assetId
    this.propertyData = data.propertyData
    setTimeout(() => {
      this.singlpePropertyMapComponent.setComparisonConfigurations(data)
      this.globalOverviewComponent.setComparisonConfigurations(data)
    })
  }

  setPdfFilters() {
    const propertyId = this.singlpePropertyMapComponent.slug
    const scenario = this.globalOverviewComponent.scenariosCompoent.selectedScenario.value
    this._climateAlphaService.pdfReportFilters$.next({ pathname: 'location-impact-pdf/' + propertyId + '/' + scenario, data: {}, reportName: 'Single Asset Report' })
  }

  ngOnDestroy(): void {
    this._climateAlphaService.pdfReportFilters$.next(undefined)
  }

}
