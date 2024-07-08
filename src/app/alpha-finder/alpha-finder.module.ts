import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlphaFinderMainComponent } from './alpha-finder-main/alpha-finder-main.component';
import { AlphaFinderRoutingModule } from './alpha-finder-routing.module';
import { SaveSelectedFeatureSearchComponent } from './save-selected-feature-search/save-selected-feature-search.component';
import { FormsModule } from '@angular/forms';
import { UserSavedSearchesComponent } from './user-saved-searches/user-saved-searches.component';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap'
import { NgSelectModule } from '@ng-select/ng-select';
import { AlphaRankingMainComponent } from './alpha-ranking-main/alpha-ranking-main.component';
import { SharedModule } from 'app/shared/shared.module';
import { SelectedFeaturesComponent } from './selected-features/selected-features.component';
import { AlphaFinderMapComponent } from './alpha-finder-map/alpha-finder-map.component';
import { AlphaRankingBarsComponent } from './alpha-ranking-bars/alpha-ranking-bars.component';
import { ActivatedRouteSnapshot } from '@angular/router';
import { AlphaSearchCanadaComponent } from './alpha-ranking-main/alpha-search-canada/alpha-search-canada.component';

@NgModule({
  declarations: [AlphaFinderMainComponent, SaveSelectedFeatureSearchComponent, UserSavedSearchesComponent, AlphaRankingMainComponent, SelectedFeaturesComponent, AlphaFinderMapComponent,
    AlphaRankingBarsComponent,
    AlphaSearchCanadaComponent
  ],
  imports: [
    CommonModule,
    AlphaFinderRoutingModule,
    FormsModule,
    NgbPopoverModule,
    NgSelectModule,
    SharedModule,
  ],
  exports: [AlphaRankingBarsComponent, AlphaFinderMapComponent]
})
export class AlphaFinderModule { }
