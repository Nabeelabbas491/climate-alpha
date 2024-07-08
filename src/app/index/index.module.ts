import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexRoutingModule } from './index-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { ResilienceScore } from './resilience-score/resilience-score.component';
import { NgCircleProgressModule } from "ng-circle-progress";
import { RiValuePipe } from './pipes/ri-value.pipe';
import { LocationImpactComponent } from './location-impact/location-impact/location-impact.component';
import { LocationBenchmarkComponent } from './location-benchmark/location-benchmark.component';
import { MarkerSliderComponent } from 'app/standalone-components/marker-slider/marker-slider.component';
import { ScenariosComponent } from './scenarios/scenarios.component';
import { BenhmarkDropdownComponent } from './benhmark-dropdown/benhmark-dropdown.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { IndicatorTabsComponent } from './location-impact/indicator-tabs/indicator-tabs.component';
import { IndicatorDetailsBarComponent } from './location-impact/indicator-details-bar/indicator-details-bar.component';
import { PhysicalImpactFeaturesComponent } from './location-impact/physical-impact-features/physical-impact-features.component';
import { ResAdjImpactFeaturesComponent } from './location-impact/res-adj-impact-features/res-adj-impact-features.component';
import { TimePeriodToggleComponent } from './time-period-toggle/time-period-toggle.component';
import { ScoreToggleComponent } from './score-toggle/score-toggle.component';
import { GlobalOverviewComponent } from './global-overview/global-overview.component';
import { LocationImpactPdfComponent } from './location-impact/location-impact-pdf/location-impact-pdf.component';
import { DownloadPdfComponent } from 'app/standalone-components/download-pdf/download-pdf.component';
import { PdfHeaderComponent } from './location-impact/location-impact-pdf/pdf-header/pdf-header.component';
import { PdfFooterComponent } from './location-impact/location-impact-pdf/pdf-footer/pdf-footer.component';
import { RiskScoreComponent } from './risk-score/risk-score.component';
import { ResiliencePanelComponent } from './location-impact/resilience-panel/resilience-panel.component';
import { LocationImpactAnalyticsComponent } from './location-impact/location-impact-analytics/location-impact-analytics.component';
@NgModule({
  declarations: [
    ResilienceScore,
    RiValuePipe,
    LocationImpactComponent,
    LocationBenchmarkComponent,
    ScenariosComponent,
    BenhmarkDropdownComponent,
    IndicatorTabsComponent,
    IndicatorDetailsBarComponent,
    PhysicalImpactFeaturesComponent,
    ResAdjImpactFeaturesComponent,
    TimePeriodToggleComponent,
    ScoreToggleComponent,
    GlobalOverviewComponent,
    LocationImpactPdfComponent,
    PdfHeaderComponent,
    PdfFooterComponent,
    RiskScoreComponent,
    ResiliencePanelComponent,
    LocationImpactAnalyticsComponent,
  ],
  imports: [
    CommonModule,
    IndexRoutingModule,
    SharedModule,
    MarkerSliderComponent,
    NgSelectModule,
    FormsModule,
    DownloadPdfComponent,
    NgCircleProgressModule.forRoot({
      // "maxPercent": 100,
      "responsive": true,
    })
  ],
  exports: [
    ResilienceScore,
    LocationImpactComponent,
    ScenariosComponent,
    BenhmarkDropdownComponent,
    GlobalOverviewComponent,
    LocationBenchmarkComponent,
    TimePeriodToggleComponent,
    ScoreToggleComponent
  ]
})
export class IndexModule { }
