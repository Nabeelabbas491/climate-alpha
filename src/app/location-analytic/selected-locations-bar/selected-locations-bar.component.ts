import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { LALocation } from '../location-analytics.interface';

@Component({
  selector: 'app-selected-locations-bar',
  templateUrl: './selected-locations-bar.component.html',
  styleUrls: ['./selected-locations-bar.component.scss']
})
export class SelectedLocationsBar {

  @Output() Selection = new EventEmitter()
  @Input() selectedLocations: Array<LALocation> = [];
  selectedLatlng = ''


}
