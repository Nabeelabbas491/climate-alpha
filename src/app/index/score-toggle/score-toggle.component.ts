import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ClimatePrice } from 'app/climate-price/climate-price.utils';
import { IndexConstants } from 'app/index/index-constants';
import { ImpactType, ScoreType } from 'app/index/index-interface';
import { ClimatePriceService } from 'app/shared/services/climate-price.service';

@Component({
  selector: 'app-score-toggle',
  templateUrl: './score-toggle.component.html',
  styleUrls: ['./score-toggle.component.scss']
})
export class ScoreToggleComponent {

  @Output() ToggleSelection = new EventEmitter<string>()
  @Input() selectedScoreType: ScoreType = IndexConstants.Score_Keys.Score.key;
  @Input() scorekeys = IndexConstants.Score_Keys
  isComparisonComponent: boolean = ClimatePrice.isComarisonComponent()

  constructor(private _climatePriceService: ClimatePriceService) { }

  selectToggle(scoreType) {
    this.selectedScoreType = scoreType
    if (this.isComparisonComponent) this._climatePriceService.selectedScoreType = this.selectedScoreType
    this.ToggleSelection.emit(scoreType)
  }
}
