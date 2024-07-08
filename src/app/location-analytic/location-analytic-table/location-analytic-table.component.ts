import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Meta, SelectedLocationsData, TableData } from '../location-analytics.interface';
import { IndexConstants } from 'app/index/index-constants';
import { ScoreType, ToggleItem } from 'app/index/index-interface';
import { ScoreToggleComponent } from 'app/index/score-toggle/score-toggle.component';
import { TimePeriodToggleComponent } from 'app/index/time-period-toggle/time-period-toggle.component';
import { LocationAnalyticModalComponent } from '../location-analytic-modal/location-analytic-modal.component';
import { AddToPortfolioModalComponent } from '../add-to-portfolio-modal/add-to-portfolio-modal.component';
import { LocationAnalytic } from '../location-analytic.utils';
import { AppPermission } from 'app/shared/data/roles';

@Component({
  selector: 'app-location-analytic-table',
  templateUrl: './location-analytic-table.component.html',
  styleUrls: ['./location-analytic-table.component.scss']
})
export class LocationAnalyticTableComponent {

  @ViewChild(LocationAnalyticModalComponent) modalComponent: LocationAnalyticModalComponent
  @ViewChild(TimePeriodToggleComponent) timePeriodToggleComponent: TimePeriodToggleComponent
  @ViewChild(ScoreToggleComponent) scoreToggleComponent: ScoreToggleComponent
  @ViewChild(AddToPortfolioModalComponent) addToPortfolioModalComponent: AddToPortfolioModalComponent
  @Output() ScoreTypeSelection = new EventEmitter<string>()
  @Output() TimePeriodSelection = new EventEmitter<ToggleItem>()
  @Input() isTrialUser: boolean;
  scoreKeys = IndexConstants.Score_Keys
  selectedScoreType: ScoreType = this.scoreKeys.Score.key
  selectedTimePeriod: ToggleItem = IndexConstants.DefaultTimePeriod
  selectedlocationsData: any = Object.assign({});
  tableData: TableData = Object.assign({})
  showTable: boolean = false
  meta: Meta;
  selectedLocationsLatLngs: Array<string> = []
  selectedScenario: string = IndexConstants.DefaultScenario;

  removeLocation(selectedLocation) {
    delete this.selectedlocationsData[selectedLocation.identifier]
    this.tableData = Object.assign({});
    this.loadTable()
  }

  updateDataDictoneryWithScore({ response, selectedLocation, scenario }) {
    this.meta = response.meta
    delete response.meta
    const latLng = selectedLocation.identifier
    if (latLng in this.selectedlocationsData) {
      this.selectedlocationsData[latLng][scenario] = response
    } else {
      this.selectedlocationsData[latLng] = { locationData: selectedLocation, [scenario]: response }
    }
  }

  // updateDataDictoneryWithBenchMark = ({ response, selectedLocation, scenario }) => this.selectedlocationsData[selectedLocation.identifier][scenario]['Benchmark'] = response

  loadTable(scenario = this.selectedScenario) {
    this.selectedScenario = scenario
    this.selectedLocationsLatLngs = Object.keys(this.selectedlocationsData)

    for (let latLng in this.selectedlocationsData) {
      const data = this.selectedlocationsData[latLng][scenario]
      // for (let impactType in data) {
      data['risk']?.Indicators?.forEach((item) => {
        this.tableData[item.headline.Title] = {
          type: 'risk',
          selectedLocations: {
            ...this.tableData[item.headline.Title]?.selectedLocations,
            [latLng]: {
              value: this.selectedScoreType in item.headline ? item.headline[this.selectedScoreType][this.selectedTimePeriod.key] : LocationAnalytic.notAvailable,
              bgColor: this.selectedScoreType in item.headline ? IndexConstants.riskColors[item.headline.Cat[this.selectedTimePeriod.key]]?.lightBackground : LocationAnalytic.bgColorUnset,
              headline: item.headline,
              locationData: this.selectedlocationsData[latLng].locationData
            }
          }
        }
      })
      // }
    }

    this.selectedLocationsLatLngs.forEach((latLng) => {
      for (let indicator in this.tableData) {
        if (!this.tableData[indicator].selectedLocations.hasOwnProperty(latLng)) {
          this.tableData[indicator].selectedLocations[latLng] = {
            value: LocationAnalytic.notAvailable,
            bgColor: LocationAnalytic.bgColorUnset,
            headline: null,
            locationData: this.selectedlocationsData[latLng].locationData
          }
        }
        this.tableData[indicator].disableEntireRow = Array.from(Object.values(this.tableData[indicator].selectedLocations), ({ value }) => value).every(m => m == LocationAnalytic.notAvailable)
      }
    })

    if (!this.showTable) this.showTable = true
  }

  onScoreTypeSelection(selectedScoreType: ScoreType) {
    this.selectedScoreType = selectedScoreType
    this.loadTable()
    this.ScoreTypeSelection.next(selectedScoreType)
  }

  onTimePeriodSelection(selectedTimePeriod: ToggleItem) {
    this.selectedTimePeriod = selectedTimePeriod
    this.loadTable()
    this.TimePeriodSelection.next(selectedTimePeriod)
  }

  openModal(row) {
    if (row.value.disableEntireRow) return;
    row = {
      indicator: row.key,
      type: row.value.type,
      locations: row.value.selectedLocations,
      meta: this.meta[row.key],
    }
    this.modalComponent.openModal(row)
  }

  removeTable(): void {
    this.showTable = false
    this.tableData = Object.assign({});
    this.selectedlocationsData = Object.assign({});
  }

  returnZero() { return 0 }

}
