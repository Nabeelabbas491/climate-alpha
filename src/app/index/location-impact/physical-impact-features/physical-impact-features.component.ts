import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { IndexConstants } from 'app/index/index-constants';
import { Indicator, ToggleItem } from 'app/index/index-interface';

@Component({
  selector: 'app-physical-impact-features',
  templateUrl: './physical-impact-features.component.html',
  styleUrls: ['../location-impact.component.scss']
})
export class PhysicalImpactFeaturesComponent implements OnChanges {

  @Output() ToggleItem = new EventEmitter<string>()
  @Input() label: string = 'Features'
  @Input() isPdf: boolean = false
  @Input() selectedIndicator;
  @Input() selectedToggleItem: ToggleItem;
  @Input() greyishBoxHeight: string
  @Input() features: ToggleItem[] = IndexConstants.riskTimePeriods;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedIndicator']) {
      this.setGreyishBoxHeight()
    }
  }


  setGreyishBoxHeight() {
    if (this.selectedIndicator != 'overview') {
      setTimeout(() => {
        const featureContainerElement = document.getElementById('features-container')
        this.greyishBoxHeight = `${featureContainerElement.offsetHeight + 12}px`
      })
    }
  }

}
