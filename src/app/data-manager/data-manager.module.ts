import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataManagerHeaderComponent } from './data-manager-header/data-manager-header.component';
import { DataManagerRoutingModule } from './data-manager.routing';
import { DataManagerSummaryComponent } from './data-manager-summary/data-manager-summary.component';
import { DataManagerAssetsComponent } from './data-manager-assets/data-manager-assets.component';
import { DataManagerFiltersComponent } from './data-manager-summary/data-manager-filters/data-manager-filters.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClimatePriceModule } from 'app/climate-price/climate-price.module';
import { NgbModule, NgbPopoverModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarItemComponent } from 'app/standalone-components/navbar-item/navbar-item.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CreatePortfolioDialogComponent } from 'app/standalone-components/create-portfolio-dialog/create-portfolio-dialog.component';
import { DataManagerAssetTable } from './data-manager-assets/data-manager-asset-table/data-manager-asset-table.component';
import { PortfolioUploadGuidelinesComponent } from './data-manager-assets/data-manager-asset-table/portfolio-upload-guidelines/portfolio-upload-guidelines.component';
import { UploadPortfolio } from './data-manager-assets/data-manager-asset-table/upload-portfolio/upload-portfolio.component';
import { FileDragDropDirective } from './directives/file-drag-drop.directive';
import { AddNewTeirModalComponent } from './data-manager-summary/add-new-teir-modal/add-new-teir-modal.component';
import { TiersDropdownsComponent } from 'app/standalone-components/tiers-dropdowns/tiers-dropdowns.component';
import { DataManagerTrialBannerComponent } from './data-manager-trial-banner/data-manager-trial-banner.component';

@NgModule({
  declarations: [
    DataManagerHeaderComponent,
    DataManagerSummaryComponent,
    DataManagerAssetsComponent,
    DataManagerFiltersComponent,
    DataManagerAssetTable,
    UploadPortfolio,
    PortfolioUploadGuidelinesComponent,
    FileDragDropDirective,
    AddNewTeirModalComponent,
    DataManagerTrialBannerComponent
  ],
  imports: [
    CommonModule,
    DataManagerRoutingModule,
    NgSelectModule,
    ReactiveFormsModule,
    ClimatePriceModule,
    NgbPopoverModule,
    NgbModule,
    FormsModule,
    NgbAlertModule,
    NgxPaginationModule,
    NavbarItemComponent,
    NgxSpinnerModule,
    // NgbTooltipModule,
    NgbPopoverModule,
    CreatePortfolioDialogComponent,
    TiersDropdownsComponent
  ],

})
export class DataManagerModule { }
