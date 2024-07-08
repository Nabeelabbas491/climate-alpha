import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { DataManagerAssetTable } from './data-manager-asset-table/data-manager-asset-table.component';
import { DataManager } from '../data-manager.utils';
import { AssetFiltersComponent } from 'app/climate-price/multiple-properties/asset-filters/asset-filters.component';
@Component({
  selector: 'app-data-manager-assets',
  templateUrl: './data-manager-assets.component.html',
  styleUrls: ['./data-manager-assets.component.scss']
})
export class DataManagerAssetsComponent implements OnInit {

  @ViewChild(AssetFiltersComponent, { static: true }) assetFiltersComponent: AssetFiltersComponent
  @ViewChild(DataManagerAssetTable, { static: true }) tableComponent: DataManagerAssetTable

  constructor() { }

  ngOnInit(): void { setTimeout(() => { this.assetFiltersComponent.tiersDropdownsComponent.allowTiersHeadingsEdit = true }) }

  async applyFilter() {
    const filters = this.assetFiltersComponent.filters.value
    const tier4Ids = this.assetFiltersComponent.payLaodTier4
    this.tableComponent.filters['tier_4'] = tier4Ids
    this.tableComponent.filters['country'] = filters.selectedCountry
    this.tableComponent.filters['state'] = filters.selectedStates
    this.tableComponent.filters['city'] = filters.selectedCities
    this.tableComponent.filters['asset_class'] = filters.selectedPropetryTypes
    this.tableComponent.pageNumber = 1
    await this.tableComponent.getData()
    this.assetFiltersComponent.totalAssets = this.tableComponent.totalAssets
    this.tableComponent.filterformValues = this.assetFiltersComponent.filters.value
  }

  async updateFiltersSection(event) {
    switch (event.type) {
      case DataManager.Events.newPortfolio:
        // updating Tier1 Listing, on newly created portfolio from data manager asset table dropdown
        this.assetFiltersComponent.tiersDropdownsComponent.addNewTier1(event.data.portfolio)
        break;
      case DataManager.Events.fileUpload:
        // reset asset table and reset all dropdowns on new file upload and update asset total count 
        await this.assetFiltersComponent.ResetAllFilters()
        await this.assetFiltersComponent.tiersDropdownsComponent.loadFilters()
        this.tableComponent.initailizedApiParams()
        await this.tableComponent.getData()
        break;
      case DataManager.Events.crud:
        // on  dublicate or delete assets or update or save from api data table
        this.assetFiltersComponent.totalAssets = this.tableComponent.totalAssets
        // updating property types dropdown on deleting a property, in case no property left with single-famliy or any other type remove that from dropdown of property types
        await this.assetFiltersComponent.getAssetFilters()
        break;
      case DataManager.Events.resetTier2:
        const uuid = this.assetFiltersComponent.filters.value.selectedTierOne
        await this.assetFiltersComponent.tiersDropdownsComponent.onTierOneSelection(uuid)
        await this.applyFilter()
        break;
      case DataManager.Events.resetTier3:
        const uuid2 = this.assetFiltersComponent.filters.value.selectedTierTwo
        await this.assetFiltersComponent.tiersDropdownsComponent.onTierTwoSelection(uuid2)
        await this.applyFilter()
        break;
      case DataManager.Events.resetTier4:
        const uuid3 = this.assetFiltersComponent.filters.value.selectedTierThree
        await this.assetFiltersComponent.tiersDropdownsComponent.onTierThreeSelection(uuid3)
        await this.applyFilter()
        break;
    }
  }

  onTierNamesChanged = (event) => this.tableComponent.setTierNames(event)
}
