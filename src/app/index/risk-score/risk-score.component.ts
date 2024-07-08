import { Component, OnInit } from '@angular/core';
import { LocationImpactComponent } from '../location-impact/location-impact/location-impact.component';
import { Impact, Indicator, IndicatorColor, ScoreType, ToggleItem } from '../index-interface';
import { IndexConstants } from '../index-constants';

@Component({
  selector: 'app-risk-score',
  templateUrl: './risk-score.component.html',
  styleUrls: ['./risk-score.component.scss']
})
export class RiskScoreComponent {

  data: Impact;
  selectedIndicator: Indicator | string = 'overview';
  selectedScoreType: ScoreType = IndexConstants.Score_Keys.Score.key;
  selectedToggleItem: ToggleItem = IndexConstants.DefaultTimePeriod;
  colors: IndicatorColor;

  setLocationScore({ data }) {
    if (!data) {
      this.removeData();
      return;
    } else {
      const indicators = data['Indicators']?.filter(Boolean).filter(m => Object.keys(m).length)
      this.data = { ...data, Indicators: indicators }
      this.selectedIndicator = this.data.Indicators.find(_ => _.headline?.Title == this.selectedIndicator['headline']?.Title) || 'overview'
      console.log("data..", this.data)
    }
  }

  removeData = () => this.data = undefined

}
