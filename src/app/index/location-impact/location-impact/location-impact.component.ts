import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ClimatePrice } from 'app/climate-price/climate-price.utils';
import { IndexConstants } from 'app/index/index-constants';
import { IndicatorColor, ScoreType, ToggleItem } from 'app/index/index-interface';
import { ClimatePriceService } from 'app/shared/services/climate-price.service';
import { element } from 'protractor';
@Component({
  selector: 'app-location-impact',
  templateUrl: './location-impact.component.html',
  styleUrls: ['../location-impact.component.scss', './location-impact.component.scss']
})

export class LocationImpactComponent {

  data: any;
  selectedIndicator: any = 'overview';
  colors: IndicatorColor = IndexConstants.riskColors;
  selectedScoreType: ScoreType = IndexConstants.Score_Keys.Score.key;
  selectedToggleItem: ToggleItem = IndexConstants.DefaultTimePeriod;
  scorekeys = IndexConstants.Score_Keys
  selectedTab: string = 'risk';
  showArrows: boolean;

  constructor(private _climatePriceService: ClimatePriceService) { }

  loadLocationImpact = (data) => {
    this.data = data
    this.selectedIndicator == 'overview' ? this.setSliders() :
      this.onIndicatorSelection(data.risk.Indicators.find(_ => _.headline.Title == this.selectedIndicator.risk.headline.Title))
    setTimeout(() => {
      const element = document.getElementById('tabs-options')
      this.showArrows = element.scrollWidth > element.clientWidth
    })
  }

  setSliders() {
    const sliderOptions = { risk: this.sliderConfigurations('risk'), resilience: this.sliderConfigurations('resilience') }
    this.data['sliderOptions'] = { ...sliderOptions }
  }

  sliderConfigurations(key) {
    const value = this.data[key].Headline[this.selectedScoreType][this.selectedToggleItem.key]
    const benchmark = this.data.selectedBenchMark[key]

    if (!benchmark) return;

    const mean = benchmark[this.selectedScoreType][this.selectedToggleItem.key].mean

    const color = () => {
      if (this.selectedScoreType == IndexConstants.Score_Keys.Impact.key) {
        return value < mean ? 'red' : 'green'
      }
      if (this.selectedScoreType == IndexConstants.Score_Keys.Score.key) {
        return value < mean ? 'green' : 'red'
      }
    }

    return {
      value: value,
      ticks: [
        benchmark[this.selectedScoreType][this.selectedToggleItem.key].min,
        benchmark[this.selectedScoreType][this.selectedToggleItem.key].mean,
        benchmark[this.selectedScoreType][this.selectedToggleItem.key].max
      ],
      label: benchmark.Title,
      color: this.selectedScoreType == IndexConstants.Score_Keys.Impact.key ? 'rgba(129, 0, 0, 1)' :
        this.colors[this.data[key]?.Headline.Cat[this.selectedToggleItem?.key]]?.mainColor,
      id: `${key}-slider-risk-score`,
      icon: this.selectedScoreType == IndexConstants.Score_Keys.Impact.key ? 'assets/img/svg/markers/red-marker.svg' :
        this.colors[this.data[key]?.Headline.Cat[this.selectedToggleItem?.key]]?.marker,
      tickUnit: this.scorekeys[this.selectedScoreType].tickUnit,
      ceilLabel: this.selectedScoreType == IndexConstants.Score_Keys.Impact.key ? "Worst" : "Best",
      floorLabel: this.selectedScoreType == IndexConstants.Score_Keys.Impact.key ? "Best" : "Worst",
      tickIndexForLabel: 1,
      benchMarkChipClass: color()
    }
  }

  onIndicatorSelection(indicator, selectedTab = this.selectedTab) {
    if (indicator == 'overview') {
      this.selectedIndicator = indicator
      this.loadLocationImpact(this.data)
    } else {
      this.selectedIndicator = {
        risk: this.data.risk.Indicators.find(_ => _.headline.Title == indicator.headline.Title),
        resilience: this.data.resilience.Indicators.find(_ => _.headline.Title == indicator.headline.Title),
      }
      this.selectedTab = selectedTab
    }
    if (ClimatePrice.isComarisonComponent()) {
      this._climatePriceService.selectedIndicator = this.selectedIndicator;
      this._climatePriceService.selectedIndicatorTab = this.selectedTab
    }
  }

  setComparisonConfigurations(data) {
    const selectedScenario = this._climatePriceService.selectedScenario?.value || data.scenario?.value
    if (this._climatePriceService.selectedIndicator && this._climatePriceService.selectedIndicator != 'overview') {
      const selectedIndicator = this._climatePriceService.selectedIndicator
      this.selectedIndicator = {
        risk: data.propertyData[selectedScenario].risk.Indicators.find(_ => _.headline.Title == selectedIndicator.risk.headline.Title),
        resilience: data.propertyData[selectedScenario].resilience.Indicators.find(_ => _.headline.Title == selectedIndicator.resilience.headline.Title),
      }
    } else {
      this.selectedIndicator = this._climatePriceService.selectedIndicator || data.selectedIndicator
    }
    this.selectedTab = this._climatePriceService.selectedIndicatorTab || data.selectedTab
    this.selectedToggleItem = this._climatePriceService.selectedTimePeriod || data.selectedTimePeriod
    this.selectedScoreType = this._climatePriceService.selectedScoreType || data.selectedScoreType
  }

  scroll(direction) {
    document.getElementById('tabs-options').scrollBy({ left: direction == 'left' ? 200 : -200, behavior: 'smooth' });
  }

  removeData = () => this.data = undefined

}
