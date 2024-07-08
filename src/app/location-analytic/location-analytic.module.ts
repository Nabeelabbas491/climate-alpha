import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationAnalyticRoutingModule } from './location-analytic.routing.module';
import { LocationAnalyticMapComponent } from './location-analytic-map/location-analytic-map.component';
import { FormsModule } from '@angular/forms';
import { LocationAnalyticTableComponent } from './location-analytic-table/location-analytic-table.component';
import { LocationAnalyticModalComponent } from './location-analytic-modal/location-analytic-modal.component';
import { LoaderComponent } from 'app/standalone-components/loader/loader.component';
import { LaValuePipe } from './pipes/location-analytic-value.pipe';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SelectedLocationsBar } from './selected-locations-bar/selected-locations-bar.component';
import { IndexModule } from 'app/index/index.module';
import { LocationSearchComponent } from './location-search/location-search.component';
import { AddToPortfolioModalComponent } from './add-to-portfolio-modal/add-to-portfolio-modal.component';
import { TiersDropdownsComponent } from 'app/standalone-components/tiers-dropdowns/tiers-dropdowns.component';
import { NoCreditsLeftModalComponent } from 'app/standalone-components/no-credits-left-modal/no-credits-left-modal.component';

@NgModule({
  declarations: [
    LocationAnalyticMapComponent,
    LocationAnalyticTableComponent,
    LocationAnalyticModalComponent,
    LaValuePipe,
    SelectedLocationsBar,
    LocationSearchComponent,
    AddToPortfolioModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    LoaderComponent,
    NgbTooltipModule,
    IndexModule,
    TiersDropdownsComponent,
    LocationAnalyticRoutingModule,
    NoCreditsLeftModalComponent
  ]
})
export class LocationAnalyticModule { }
