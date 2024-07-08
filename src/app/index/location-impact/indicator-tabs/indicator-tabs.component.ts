import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClimatePrice } from 'app/climate-price/climate-price.utils';
import { ImpactType, Indicator, IndicatorColor, ToggleItem } from 'app/index/index-interface';
import { AppPermission } from 'app/shared/data/roles';
import { ClimatePriceService } from 'app/shared/services/climate-price.service';

@Component({
  selector: 'app-indicator-tabs',
  templateUrl: './indicator-tabs.component.html',
  styleUrls: ['./indicator-tabs.component.scss']
})

export class IndicatorTabsComponent {

  @Output() Item = new EventEmitter<Indicator | string>();
  @Input() indicators: Indicator[];
  @Input() selectedIndicator: Indicator | string;
  @Input() selectedToggleItem: ToggleItem;
  @Input() colors: IndicatorColor;

}
