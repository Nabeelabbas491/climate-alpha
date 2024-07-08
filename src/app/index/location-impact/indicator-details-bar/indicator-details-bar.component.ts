import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IndexConstants } from 'app/index/index-constants';
import { Indicator, ScoreType, ToggleItem, IndicatorColor } from 'app/index/index-interface';
@Component({
  selector: 'app-indicator-details-bar',
  templateUrl: './indicator-details-bar.component.html',
  styleUrls: ['./indicator-details-bar.component.scss']
})

export class IndicatorDetailsBarComponent {

  @Output() Item = new EventEmitter<Indicator | string>();
  @Input() selectedIndicator: any;
  @Input() selectedToggleItem: ToggleItem;
  @Input() selectedScoreType: ScoreType;
  @Input() colors: IndicatorColor;
  @Input() type: string
  @Input() showBorder = false
  scorekeys = IndexConstants.Score_Keys;
  indicatorsDict = IndexConstants.Indicators_Dict

}
