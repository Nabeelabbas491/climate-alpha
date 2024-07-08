import { Component, Input, OnInit } from '@angular/core';
import { IndexConstants } from '../index-constants';
import { ClimateIndex, ReadinessIndex, VulnerabilityIndex } from '../index-interface';
import { AppConstants } from 'app/shared/data/constants';

@Component({
  selector: 'app-resilience-score',
  templateUrl: './resilience-score.component.html',
  styleUrls: ['./resilience-score.component.scss']
})
export class ResilienceScore implements OnInit {

  @Input() title: string = '';
  @Input() subTitle: string = '';
  @Input() key: string = '';
  data: ClimateIndex | ReadinessIndex | VulnerabilityIndex;
  colors: Object;
  boxColors: Object;
  scenarios = {
    "RCP34": {
      "id": "Green",
      "title": "Optimistic Scenario",
      "sub_title": "SSP1 RCP3.4",
      "icon": AppConstants.SMILE_ICON,
      "summary": "The Optimistic scenario (SSP1 RCP3.4) represents a world with stable economic development and carbon emissions peaking and declining before 2040," +
        " with emissions constrained to stabilize lower than ~650 ppm CO2 and temperatures to 2.0–2.4°C by 2100."
    },
    "RCP45": {
      "id": "BAU",
      "title": "Business as Usual Scenario",
      "sub_title": "SSP3 RCP4.5",
      "icon": AppConstants.MEH_ICON,
      "summary": "The Business as Usual (BAU) scenario  (SSP3 RCP4.5) represents a world with stable economic development and carbon emissions peaking and declining by 2045," +
        " with emissions constrained to stabilize at ~650 ppm CO2 and temperatures to 2.6–3.2°C by 2100."
    },
    "RCP85": {
      "id": "Bad",
      "title": "Pessimistic Scenario",
      "sub_title": "SSP5 RCP8.5",
      "icon": AppConstants.FROWN_ICON,
      "summary": "The Pessimistic scenario (SSP5 RCP8.5) represents a fragmented world with uneven economic development, higher population growth," +
        " lower GDP growth, a lower rate of urbanization and steadily rising global carbon emissions," +
        " with CO2 concentrations reaching ~1370 ppm by 2100 and global mean temperatures increasing by 2.6–4.8°C relative to 1986–2005 levels."
    }
  };

  async ngOnInit() {
    switch (this.key) {
      case 'Overall':
        this.colors = IndexConstants.climateColors
        this.boxColors = IndexConstants.climateBoxColors
        return;
      case 'Vulnerability':
        this.colors = IndexConstants.vulnerabilityColors
        this.boxColors = IndexConstants.vulnerabilityBoxColors
        return;
      case 'Readiness':
        this.colors = IndexConstants.readinessColors
        this.boxColors = IndexConstants.readinessBoxColors
        return;
    }
  }

  returnZero() {
    return 0
  }

}
