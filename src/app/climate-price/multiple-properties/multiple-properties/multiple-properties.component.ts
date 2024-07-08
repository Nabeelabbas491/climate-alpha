import { Component, OnInit, ViewChild } from '@angular/core';
import { ClimatePriceService } from 'app/shared/services/climate-price.service';
import { AssetFiltersComponent } from '../asset-filters/asset-filters.component';
import { AnaylyticsTableComponent } from '../anaylytics-table/anaylytics-table.component';
import { AnalyticMapComponent } from '../analytic-map/analytic-map.component';
import { DownloadPDFService } from 'app/shared/services/download-chart-service';
import { ActivatedRoute } from '@angular/router';
import { Messages } from 'app/shared/data/messages';
import { ClimatePriceHeaderComponent } from 'app/climate-price/climate-price-header/climate-price-header.component';
import { DexieService } from 'app/shared/services/dexie.service';
import { ToastrService } from 'ngx-toastr';
import { ClimatePrice } from 'app/climate-price/climate-price.utils';
import { AppConstants } from 'app/shared/data/constants';
import { MultiAssetOverviewComponent } from 'app/climate-price/multiple-properties/multi-asset-overview/multi-asset-overview.component';
import { ToggleItem } from 'app/index/index-interface';
import { AuthService } from 'app/shared/services/auth.service';
@Component({
  selector: 'app-multiple-properties',
  templateUrl: './multiple-properties.component.html',
  styleUrls: ['./multiple-properties.component.scss']
})
export class MultiplePropertiesComponent implements OnInit {

  @ViewChild(ClimatePriceHeaderComponent) climatePriceHeaderComponent: ClimatePriceHeaderComponent
  @ViewChild(AssetFiltersComponent) assetFiltersComponent: AssetFiltersComponent
  @ViewChild(AnalyticMapComponent) analyticMapComponent: AnalyticMapComponent
  @ViewChild(MultiAssetOverviewComponent) multiAssetOverviewComponent: MultiAssetOverviewComponent
  @ViewChild(AnaylyticsTableComponent) anaylyticsTableComponent: AnaylyticsTableComponent
  isComparisonComponent: boolean = ClimatePrice.isComarisonComponent()
  currentComparison: any
  showDataProcessingMessage: boolean = false
  dataMessage: string = Messages.SUMMARY;
  isTrialUser: boolean;

  constructor(private _climatePriceService: ClimatePriceService,
    private _dexieService: DexieService,
    public _route: ActivatedRoute,
    public downloadPdfs: DownloadPDFService,
    private _authService: AuthService
  ) {
    this.isTrialUser = this._authService.isPortfolioAnalyticsTrialUser()
  }

  ngOnInit(): void { this.loadMultiAsset() }

  async loadMultiAsset(): Promise<void> {
    if (window.location.search.includes(AppConstants.Public_Link_Key)) return;
    if (!this.isComparisonComponent) {
      await this._climatePriceService.deleteFilters()
    }
  }

  onError(section): void {
    switch (section) {
      case 'asset filters':
        this.showDataProcessingMessage = true
        break;
    }
    this.assetFiltersComponent.apiCallInProgress = false;
  }

  onYearChange(): void { }

  /** updating overview data (map, benchmark, financial metrics, graph, Table ) on a scenario dropdown change */
  async onScenarioChange(): Promise<void> {
    const scenario = this.multiAssetOverviewComponent.scenariosCompoent.selectedScenario.value
    if (!this.isComparisonComponent) this.assetFiltersComponent.apiCallInProgress = true;
    if (this.isComparisonComponent && this.currentComparison.scenario.value == scenario) {
      this.loadFilteredComparison(this.currentComparison)
    } else {
      // updating map
      this.analyticMapComponent.selectedScenario = scenario
      await this.analyticMapComponent.getData()
      // updating overview
      this.multiAssetOverviewComponent.selectedScenario = scenario
      await this.multiAssetOverviewComponent.getData()
      // updating table
      this.anaylyticsTableComponent.selectedScenario = scenario
      await this.anaylyticsTableComponent.getAssets()
    }
    if (!this.isComparisonComponent) this.assetFiltersComponent.apiCallInProgress = false;
  }

  onTimePeriodChange = (event: ToggleItem) => this.anaylyticsTableComponent.selectedTimePeriod = event

  enableAddToComparisonBtn() {
    if (this.isComparisonComponent) return;
    const isAllApiSubscribed = this.anaylyticsTableComponent.isApiSusbcribed && this.analyticMapComponent.isApiSubscribed && this.multiAssetOverviewComponent.isApiSusbcribed
    if (isAllApiSubscribed) this.assetFiltersComponent.apiCallInProgress = false;
  }

  async onSavedFilterApplied(item) {
    try {
      await this.applyFilters()
      await this._climatePriceService.updateFilter({ properties: this.assetFiltersComponent.totalAssets, uuid: item.uuid })
    } catch (e) { console.log(e) }
  }

  async applyFilters(): Promise<void> {
    try {
      this.assetFiltersComponent.apiCallInProgress = true;
      const filters = this.assetFiltersComponent.filters.value
      const body = {
        country: filters.selectedCountry,
        state: filters.selectedStates,
        city: filters.selectedCities,
        asset_class: filters.selectedPropetryTypes,
        tier_4: this.assetFiltersComponent.payLaodTier4,
      }
      this.anaylyticsTableComponent.allAssets = undefined
      // updating assets counts from response
      let response: string[] = await this._climatePriceService.applyFilters(body)
      this.assetFiltersComponent.totalAssets = response.length
      // updating map, benchmark, financial metrics, graph and8 Table  
      await Promise.all([
        this.multiAssetOverviewComponent.getData(),
        this.anaylyticsTableComponent.getAssets(),
        this.analyticMapComponent.getData()
      ])
      this.assetFiltersComponent.apiCallInProgress = false;
    } catch (e) { this.assetFiltersComponent.apiCallInProgress = false; }
  }

  /** updating overview section (benchmark, financial metrics, graph ) and map section for selected hidden properties from table section */
  async getResultForHiddenProperties() {
    try {
      this.assetFiltersComponent.apiCallInProgress = true;
      await Promise.all([
        this.multiAssetOverviewComponent.getData(),
        this.analyticMapComponent.getData()
      ])
      this.assetFiltersComponent.apiCallInProgress = false;
    } catch (e) { this.assetFiltersComponent.apiCallInProgress = false; }
  }

  async addToComparison() {
    if (this.assetFiltersComponent.apiCallInProgress) return;
    // if (!this.enableAddToComparisonBtn()) { return this._toastr.error(ClimatePrice.Error_Msg_Comparison) }
    this._dexieService.addRecord({ data: this.analyticMapComponent.apiData }).then((id) => {
      let data: { [key: string]: Object | number | string } = {
        // comparison record information
        id: AppConstants.uniqueId,
        type: 'Multi-asset View',
        title: this.assetFiltersComponent.comparisonName,
        recordId: id,
        assetsCount: this.assetFiltersComponent.totalAssets,
        // selected scenario and benchmark
        scenario: this.multiAssetOverviewComponent.scenariosCompoent.selectedScenario,
        benchmark: this.multiAssetOverviewComponent.dropdown.selectedBenchmark,
        benchMarkData: this.multiAssetOverviewComponent.dropdown.response,
        // selected timePeriod and ScoreType
        selectedScoreType: this.multiAssetOverviewComponent.physicalImpactBenchMark.scoreToggleComponent.selectedScoreType,
        selectedTimePeriod: this.multiAssetOverviewComponent.physicalImpactBenchMark.timePeriodToggleComponent.selectedToggleItem,
        // overview Data
        overviewData: this.multiAssetOverviewComponent.response,
        // map data
        multiAssetMapSelectedLabel: this.analyticMapComponent.selectedSection,
        // table data
        tableData: this.anaylyticsTableComponent.response,
        hiddenProperties: !this.anaylyticsTableComponent.showEyeColumn ? this.anaylyticsTableComponent.confirmedhiddenProperties : [],
        rowsPerPage: this.anaylyticsTableComponent.rowsPerPage,
        tablePageNumber: this.anaylyticsTableComponent.pageNumber
      }
      let list = this._climatePriceService.getComparisonList() ?? []
      list.push(data)
      this.climatePriceHeaderComponent.comparisonCount = list.length
      this._climatePriceService.saveInLocalStorage(list)
      this.assetFiltersComponent.resetComparisonName()
    })
  }

  async loadFilteredComparison(data) {
    this.currentComparison = data
    this._dexieService.getDataById(data.recordId).then(async (res) => {
      //  overview 
      if (this._climatePriceService.selectedScenario && this._climatePriceService.selectedScenario.value != data.scenario.value) {
        this.onScenarioChange()
      } else {
        this.multiAssetOverviewComponent.setComparisonConfigurations(data)
      }
      // loading table
      this.anaylyticsTableComponent.setComparisonConfigurations(data)
      // loading map
      this.analyticMapComponent.apiData = res.data
      this.analyticMapComponent.onMapTypeChange(this._climatePriceService.multiAssetMapSelectedLabel || data.multiAssetMapSelectedLabel)
    })
  }

}
