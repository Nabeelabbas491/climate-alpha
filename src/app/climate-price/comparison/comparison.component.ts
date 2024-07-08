import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ClimatePriceService } from 'app/shared/services/climate-price.service';
import { MultiplePropertiesComponent } from '../multiple-properties/multiple-properties/multiple-properties.component';
import { SinglePropertyComponent } from '../single-property/single-property/single-property.component';
import { Router } from '@angular/router';
import { ClimatePriceHeaderComponent } from '../climate-price-header/climate-price-header.component';
import { DexieService } from 'app/shared/services/dexie.service';
@Component({
  selector: 'app-comparison',
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.scss']
})
export class ComparisonComponent implements AfterViewInit, OnDestroy {

  @ViewChild(ClimatePriceHeaderComponent) climatePriceHeaderComponent: ClimatePriceHeaderComponent
  @ViewChild(MultiplePropertiesComponent) mulitAssetRef: MultiplePropertiesComponent
  @ViewChild(SinglePropertyComponent) singleAssetRef: SinglePropertyComponent
  comparisonList = []
  selectedFilter;

  constructor(
    private _climatePriceService: ClimatePriceService,
    private _router: Router,
    private _dexieService: DexieService,
    private _cdr: ChangeDetectorRef) {
    this.comparisonList = this._climatePriceService.getComparisonList()
    !this.comparisonList?.length && window.history.back()
    this.comparisonList = this.comparisonList.map((m, idx) => { return { ...m, id: idx + 1 } })
    this.selectedFilter = this.comparisonList[0]
  }

  ngAfterViewInit(): void {
    this.loadComponent()
  }

  loadComponent() {
    this._cdr.detectChanges()
    switch (this.selectedFilter.type) {
      case 'Multi-asset View':
        this.mulitAssetRef.loadFilteredComparison(this.selectedFilter)
        break;
      case 'Single-Asset':
        this.singleAssetRef.loadFilteredComparison(this.selectedFilter)
        break;
    }
  }

  remove(item) {
    // deleting record from indexed db for multi asset case
    if (this.selectedFilter.type == 'Multi-asset View') this._dexieService.deleteRecord(item.recordId)
    if (this.comparisonList.length == 1) {
      this._climatePriceService.deleteComparisonList()
      this._router.navigate(['/portfolio-analytics/multiple-assets'])
    } else {
      const index = this.comparisonList.findIndex(m => m.id == item.id)
      if (item.id == this.selectedFilter.id) {
        // checking if last comparison is selected and user is deleting the last one, then select the first one and load it 
        if (item.id == this.comparisonList[this.comparisonList.length - 1].id) {
          this.selectedFilter = this.comparisonList[0]
        } else {
          this.selectedFilter = this.comparisonList[index + 1]
        }
      }
      this.comparisonList.splice(index, 1)
      this.climatePriceHeaderComponent.comparisonCount = this.comparisonList.length
      this.loadComponent()
      this._climatePriceService.saveInLocalStorage(this.comparisonList)
    }
  }

  ngOnDestroy(): void {
    this._climatePriceService.resetVariables()
  }
}
