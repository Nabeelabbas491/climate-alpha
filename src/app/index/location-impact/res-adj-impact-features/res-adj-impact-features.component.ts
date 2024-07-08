import { Component, Input } from '@angular/core';
import { IndexConstants } from 'app/index/index-constants';
import { FeatureType, Indicator } from 'app/index/index-interface';
@Component({
  selector: 'app-res-adj-impact-features',
  templateUrl: './res-adj-impact-features.component.html',
  styleUrls: ['../location-impact.component.scss']
})
export class ResAdjImpactFeaturesComponent {

  @Input() label: string = 'Features'
  @Input() isPdf: boolean = false
  @Input() selectedIndicator: Indicator;
  @Input() featuresType: FeatureType;
  features = IndexConstants.ResilienceFeatures



}
