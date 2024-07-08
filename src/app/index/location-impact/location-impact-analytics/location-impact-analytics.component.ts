import { Component, Input, OnInit } from '@angular/core';
import { IndexConstants } from 'app/index/index-constants';

@Component({
  selector: 'app-location-impact-analytics',
  templateUrl: './location-impact-analytics.component.html',
  styleUrls: ['./location-impact-analytics.component.scss']
})
export class LocationImpactAnalyticsComponent {

  @Input() data
  colors = IndexConstants.riskColors
  scenarios = [
    { label: "LOW", value: "Low" },
    { label: "MED", value: "Medium" },
    { label: "HIGH", value: "High" }
  ]

}
