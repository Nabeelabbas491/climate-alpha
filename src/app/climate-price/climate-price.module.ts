import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SinglePropertyComponent } from './single-property/single-property/single-property.component';
import { MultiplePropertiesComponent } from './multiple-properties/multiple-properties/multiple-properties.component';
import { ClimatePriceRoutingModule } from './climate-price.routing.module';
import { ClimatePriceHeaderComponent } from './climate-price-header/climate-price-header.component';
import { AssetFiltersComponent } from './multiple-properties/asset-filters/asset-filters.component';
import { ChartistModule } from 'ng-chartist';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IndexModule } from 'app/index/index.module';
import { AnaylyticsTableComponent } from './multiple-properties/anaylytics-table/anaylytics-table.component';
import { AnalyticMapComponent } from './multiple-properties/analytic-map/analytic-map.component';
import { SinglpePropertyMapComponent } from './single-property/singlpe-property-map/singlpe-property-map.component';
import { SummaryComponent } from './summary/summary.component';
import { ImpactAnalyzerTableComponent } from './summary/impact-analyzer-table/impact-analyzer-table.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbPopoverModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ComparisonComponent } from './comparison/comparison.component';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarItemComponent } from 'app/standalone-components/navbar-item/navbar-item.component';
import { CommaPipe } from './pipe/comma.pipe';
import { MarkerSliderComponent } from 'app/standalone-components/marker-slider/marker-slider.component';
import { LoaderComponent } from 'app/standalone-components/loader/loader.component';
import { TiersDropdownsComponent } from 'app/standalone-components/tiers-dropdowns/tiers-dropdowns.component';
import { UserFiltersComponent } from './multiple-properties/user-filters/user-filters.component';
import { MultiAssetOverviewComponent } from './multiple-properties/multi-asset-overview/multi-asset-overview.component';
import { DownloadPdfComponent } from 'app/standalone-components/download-pdf/download-pdf.component';
import { TrialUserBannerComponent } from './trial-user-banner/trial-user-banner.component';
@NgModule({
  declarations: [
    SinglePropertyComponent,
    MultiplePropertiesComponent,
    ClimatePriceHeaderComponent,
    AssetFiltersComponent,
    AnaylyticsTableComponent,
    AnalyticMapComponent,
    SinglpePropertyMapComponent,
    SummaryComponent,
    ImpactAnalyzerTableComponent,
    ComparisonComponent,
    CommaPipe,
    UserFiltersComponent,
    MultiAssetOverviewComponent,
    TrialUserBannerComponent
  ],
  imports: [
    CommonModule,
    ChartistModule,
    ClimatePriceRoutingModule,
    NgxSliderModule,
    NgSelectModule,
    FormsModule,
    NgbPopoverModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgbAlertModule,
    IndexModule,
    NavbarItemComponent,
    TiersDropdownsComponent,
    NgbTooltipModule,
    MarkerSliderComponent,
    LoaderComponent,
    DownloadPdfComponent
  ],
  exports: [AssetFiltersComponent]
})
export class ClimatePriceModule { }
