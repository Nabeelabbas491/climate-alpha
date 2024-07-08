import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticTable, AnalyticTableResponse, NationAverage } from 'app/climate-price/climate-price.interface';
import { ClimatePrice } from 'app/climate-price/climate-price.utils';
import { IndexConstants } from 'app/index/index-constants';
import { ToggleItem } from 'app/index/index-interface';
import { AppConstants } from 'app/shared/data/constants';
import { ClimatePriceService } from 'app/shared/services/climate-price.service';

@Component({
  selector: 'app-anaylytics-table',
  templateUrl: './anaylytics-table.component.html',
  styleUrls: ['./anaylytics-table.component.scss']
})
export class AnaylyticsTableComponent implements OnInit {

  @Output() HideProperties = new EventEmitter();
  @Output() ApiSubscribed = new EventEmitter();
  showEyeColumn: boolean = false
  rowsPerPageList: Array<number> = [12, 25, 50, 100, 200]
  rowsPerPage: number = this.rowsPerPageList[0]
  pageNumber: number = 1;
  totalRecords: number;
  search: string = ''
  response: AnalyticTableResponse;
  allAssets: Array<AnalyticTable>
  // nationalAvg: NationAverage;
  tempHiddenProperties: Array<string> = [];
  confirmedhiddenProperties: Array<string> = [];
  sortBy: string = ''
  sortOrder: string = ''
  // scenario: string = ClimatePrice.DefaultScenario()
  showAll: boolean;
  hideAll: boolean;
  eyesColumnSortingApplied: boolean = false
  hiddenRowsSortOrder: string = "asc"
  isApiSusbcribed: boolean;
  selectedBenchMarkData: { [key: string]: string | number };
  headers = [
    { title: 'Address ', sort: 'asc', key: 'title', sortableColumn: true, type: 'string', show: true },
    { title: 'Market Value ($) ', sort: 'asc', key: 'valuation', sortableColumn: true, type: 'number', show: true },
    { title: 'Physical Impact (%) ', sort: 'asc', key: 'physical_impact', sortableColumn: true, type: 'number', show: true },
    { title: 'Heat Stress Score', sort: '', key: 'heat_score', sortableColumn: false, type: 'number', show: true },
    { title: 'Drought Score', sort: '', key: 'drought_score', sortableColumn: false, type: 'number', show: true },
    { title: 'Hurricane Wind Score ', sort: '', key: 'wind_score', sortableColumn: false, type: 'number', show: true },
    { title: 'Inland Flooding Score ', sort: '', key: 'inland_flooding_score', sortableColumn: false, type: 'number', show: true },
    { title: 'Coastal Flooding Score ', sort: '', key: 'coastal_flooding_score', sortableColumn: false, type: 'number', show: true },
    { title: 'Wildfire Score', sort: '', key: 'fire_score', sortableColumn: false, type: 'number', show: true },
  ]
  selectedScenario = IndexConstants.DefaultScenario
  selectedTimePeriod: ToggleItem = IndexConstants.DefaultTimePeriod;

  constructor(private _climatePriceService: ClimatePriceService, private router: Router) { this.disableShowAllBtn() }

  async ngOnInit(): Promise<void> {
    if (window.location.pathname.includes('multiple-assets')) {
      if (window.location.search.includes(AppConstants.Public_Link_Key)) return;
      await this.getAssets()
    }
  }

  async getAssets() {
    try {
      this.isApiSusbcribed = false
      const params = { page: this.pageNumber, pageSize: this.rowsPerPage, search: this.search.replace('&', '|'), sortBy: this.sortBy, sortOrder: this.sortOrder, scenario: this.selectedScenario }
      this.response = await this._climatePriceService.getMultiAssets(params)
      this.loadTable(this.response)
      this.isApiSusbcribed = true
      this.ApiSubscribed.next()
    } catch (e) { this.isApiSusbcribed = true }
  }

  loadTable(response) {
    this.allAssets = response['data']
    this.totalRecords = response['properties_count']
    this.allAssets = this.allAssets.map((m: any) => {
      if (this[this.showEyeColumn ? 'tempHiddenProperties' : 'confirmedhiddenProperties'].indexOf(m.uuid) !== -1) {
        return { ...m, show: false }
      }
      else return { ...m, show: true }
    })
    this.eyesColumnSortingApplied && this.sortHiddenRows(false)
  }

  sort(item) {
    item.sort = ['dsc'].includes(item.sort) ? 'asc' : 'dsc'
    this.sortOrder = item.sort
    this.sortBy = item.key
    this.getAssets()
  }

  onHideOrShow(item) {
    item.show = !item.show
    let propertyIndex = this.tempHiddenProperties.indexOf(item.uuid);
    if (propertyIndex !== -1) {
      this.tempHiddenProperties.splice(propertyIndex, 1)
    }
    else {
      this.tempHiddenProperties.push(item.uuid)
    }
    const showValues = Array.from(this.allAssets, ({ show }) => show)
    if (showValues.every(m => m == false)) {
      this.disableHideAllBtn()
    } else if (showValues.every(m => m == true)) {
      this.disableShowAllBtn()
    } else {
      this.showAll = false
      this.hideAll = false
    }
  }

  loadSingleAsset(item) {
    const pathname = `portfolio-analytics/single-asset/${item.uuid}`
    item.show && this.router.navigate([pathname])
  }

  async confirm() {
    try {
      this.showEyeColumn = !this.showEyeColumn;
      this.confirmedhiddenProperties = structuredClone(this.tempHiddenProperties)
      let body = { uuids: this.tempHiddenProperties }
      await this._climatePriceService.hideSelectedPropertiesResult(body)
      this.HideProperties.next()
    } catch (e) { }
  }

  cancel() {
    this.showEyeColumn = !this.showEyeColumn;
    this.tempHiddenProperties = structuredClone(this.confirmedhiddenProperties)
    this.allAssets = this.allAssets.map((m: any) => {
      if (this.confirmedhiddenProperties.indexOf(m.uuid) !== -1) {
        return { ...m, show: false }
      }
      else return { ...m, show: true }
    })
  }

  disableHideAllBtn() {
    this.showAll = true
    this.hideAll = false
  }

  disableShowAllBtn() {
    this.showAll = false;
    this.hideAll = true
  }

  hideAllRows() {
    this.disableHideAllBtn()
    this.allAssets = this.allAssets.map(m => { return { ...m, show: false } })
    this.allAssets.forEach((m: AnalyticTable) => {
      !this.tempHiddenProperties.includes(m.uuid) && this.tempHiddenProperties.push(m.uuid)
    })
  }

  showAllRows() {
    this.disableShowAllBtn()
    this.allAssets = this.allAssets.map(m => { return { ...m, show: true } })
    this.allAssets.forEach((item: AnalyticTable) => {
      if (this.tempHiddenProperties.includes(item.uuid)) {
        const index = this.tempHiddenProperties.findIndex(m => m == item.uuid)
        this.tempHiddenProperties.splice(index, 1)
      }
    })
  }

  sortHiddenRows(changeSortOrder) {
    this.eyesColumnSortingApplied = true
    if (changeSortOrder) {
      this.hiddenRowsSortOrder = this.hiddenRowsSortOrder.includes('asc') ? "desc" : "asc"
    }
    this.allAssets = this.hiddenRowsSortOrder == 'asc' ? this.allAssets.sort((a, b) => a.show < b.show ? -1 : 1) : this.allAssets.sort((a, b) => b.show < a.show ? -1 : 1)
  }


  setComparisonConfigurations(comparison) {
    this.selectedTimePeriod = comparison.selectedTimePeriod
    this.selectedScenario = this._climatePriceService?.selectedScenario?.value || comparison.scenario.value
    this.confirmedhiddenProperties = comparison.hiddenProperties
    this.loadTable(comparison.tableData)
    this.rowsPerPage = comparison.rowsPerPage
    this.pageNumber = comparison.tablePageNumber
  }


}
