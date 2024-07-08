import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { IndexConstants } from 'app/index/index-constants';
import { ImpactType, ToggleItem, Benchmark, IndicatorColor } from 'app/index/index-interface';
import { MarkerSliderComponent, SliderConfig } from 'app/standalone-components/marker-slider/marker-slider.component';
import { TimePeriodToggleComponent } from '../time-period-toggle/time-period-toggle.component';
import { ScoreToggleComponent } from '../score-toggle/score-toggle.component';
@Component({
  selector: 'app-location-benchmark',
  templateUrl: './location-benchmark.component.html',
  styleUrls: ['./location-benchmark.component.scss']
})
export class LocationBenchmarkComponent {

  @ViewChild(TimePeriodToggleComponent) timePeriodToggleComponent: TimePeriodToggleComponent
  @ViewChild(ScoreToggleComponent) scoreToggleComponent: ScoreToggleComponent
  @ViewChild(MarkerSliderComponent) markerSlider: MarkerSliderComponent
  @Output() ScoreTypeSelection = new EventEmitter<string>()
  @Output() TimePeriodSelection = new EventEmitter<ToggleItem>()
  @Input() impactType: ImpactType;
  @Input() headlineTitle: string;
  @Input() explainer: string;
  @Input() sliderId: string;
  @Input() noDataAvailbale: boolean = false
  @Input() noDataAvailableMsg = '';
  value: number | string
  redMarker: string = 'assets/img/svg/markers/red-marker.svg'
  greenMarker: string = 'assets/img/svg/markers/green-marker.svg'
  sliderOptions: SliderConfig;
  scorekeys = IndexConstants.Score_Keys
  selectedBenchMark: Benchmark;
  class: string;

  colors: IndicatorColor = IndexConstants.riskColors;
  data;


  updateComponent({ data, benchmark = undefined }) {
    if (benchmark) this.selectedBenchMark = benchmark;
    this.data = data
    this.value = data?.value
    if (data.cat) this.class = this.colors[data.cat]['chip-class']
    this.sliderOptions = this.sliderConfigurations
  }

  get sliderCielFloorLabel() {
    if (this.impactType == 'Physical Impact') {
      const selectedScoreType = this.scoreToggleComponent.selectedScoreType
      if (selectedScoreType == IndexConstants.Score_Keys.Impact.key) {
        return { cielLabel: 'Worst', floorLabel: 'Best' }
      } else {
        return { cielLabel: 'Best', floorLabel: 'Worst' }
      }
    } else {
      return { cielLabel: 'Worst', floorLabel: 'Best' }
    }
  }

  // get color() {
  //   if (!this.selectedBenchMark) return;
  //   const selectedScoreType = this.scoreToggleComponent.selectedScoreType
  //   const mean = this.selectedBenchMark[selectedScoreType][this.timePeriodToggleComponent.selectedToggleItem.key].mean
  //   switch (this.impactType) {
  //     case 'Physical Impact':
  //       /* 
  //       for Impact ---> less than mean ( red )  |  more than or equal to mean ( green ) 
  //       for Score  ---> less than mean ( green ) |  more than or equal to mean ( red ) 
  //       */
  //       if (selectedScoreType == IndexConstants.Score_Keys.Impact.key) {
  //         return this.value as number < mean ? 'red' : 'green'
  //       }
  //       if (selectedScoreType == IndexConstants.Score_Keys.Score.key) {
  //         return this.value as number < mean ? 'green' : 'red'
  //       }
  //     case 'Resilience-Adjusted Impact':
  //       /* 
  //       less than mean ( red ) |  more than or equal to mean ( green ) ( Same for Impact and Score )
  //        */
  //       return this.value as number < mean ? 'red' : 'green'
  //   }
  // }

  get sliderConfigurations() {
    if (!this.selectedBenchMark) return;
    const selectedTimePeriod = this.timePeriodToggleComponent.selectedToggleItem
    const selectedScoreType = this.scoreToggleComponent.selectedScoreType
    return {
      ticks: [
        this.selectedBenchMark[selectedScoreType][selectedTimePeriod.key].min,
        this.selectedBenchMark[selectedScoreType][selectedTimePeriod.key].mean,
        this.selectedBenchMark[selectedScoreType][selectedTimePeriod.key].max
      ],
      label: this.selectedBenchMark.Title,
      id: this.sliderId,
      icon: this.colors[this.data.cat]?.marker,
      tickUnit: this.scorekeys[selectedScoreType].tickUnit,
      ceilLabel: this.sliderCielFloorLabel.cielLabel,
      floorLabel: this.sliderCielFloorLabel.floorLabel,
      tickIndexForLabel: 1,
    }
  }

  removeData = () => (this.value = null, this.sliderOptions = undefined, this.class = null)


}
