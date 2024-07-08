import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { AppConstants } from 'app/shared/data/constants';
import { AppService } from 'app/shared/services/app.service';
import { AuthService } from 'app/shared/services/auth.service';
import { ClimatePriceService } from 'app/shared/services/climate-price.service';
import { DataManagerService } from 'app/shared/services/data-manager.service';
import { TiersDropdownsComponent } from 'app/standalone-components/tiers-dropdowns/tiers-dropdowns.component';
import { ToastrService } from 'ngx-toastr';
import { AppPermission } from 'app/shared/data/roles';
import { UserFiltersComponent } from '../user-filters/user-filters.component';
import { TierHeadings } from 'app/climate-price/climate-price.interface';
import { DownloadPDF } from 'app/shared/services/download.service';
@Component({
  selector: 'app-asset-filters',
  templateUrl: './asset-filters.component.html',
  styleUrls: ['./asset-filters.component.scss'],
})
export class AssetFiltersComponent implements OnInit {

  @ViewChild(NgbPopover) popover: NgbPopover;
  @ViewChild(TiersDropdownsComponent) tiersDropdownsComponent: TiersDropdownsComponent
  @ViewChild(UserFiltersComponent) userFiltersComponent: UserFiltersComponent
  @Output() ApplyFilter = new EventEmitter<void>();
  @Output() SavedFilterApplied = new EventEmitter();
  @Output() AddToComparison = new EventEmitter<void>();
  @Output() TierNamesChanged = new EventEmitter<TierHeadings>()
  @Input() totalAssets: number;
  apiCallInProgress: Boolean = true
  accordianOpen: boolean = true
  assetFilters: { [key: string]: Array<string | object> };
  filters: FormGroup;
  panelId: string = 'panel-filter-properties'
  arrowId: string = 'accordian-arrow-filter-properties'
  shareableLink: boolean = window.location.search.includes(AppConstants.Public_Link_Key);
  permissions = AppPermission.get().PorftolioAnalytics_DataManager
  comparisonName: string = ''

  constructor(
    public _climatePriceService: ClimatePriceService,
    public _modalService: NgbModal,
    public _dataManagerService: DataManagerService,
    public _fb: FormBuilder,
    public _route: ActivatedRoute,
    public _authService: AuthService,
    public _toastr: ToastrService,
    public _appService: AppService) {
    this.initializeForm()
    this._appService.filters = this.filters.value
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.setAccordian()
      this.popover?.shown.subscribe(() => {
        const input = document.getElementById('popover-comparison-name-input')
        input?.focus()
      })
    })
  }

  initializeForm() {
    this.filters = this._fb.group({
      selectedTierOne: new FormControl(false),
      selectedTierTwo: new FormControl(false),
      selectedTierThree: new FormControl(false),
      selectedTierFour: new FormControl(false),
      selectedCountry: new FormControl(''),
      selectedCities: new FormControl(''),
      selectedStates: new FormControl(''),
      selectedPropetryTypes: new FormControl('')
    })
  }

  setAccordian() {
    const panel = document.getElementById(this.panelId);
    if (panel) panel.style.maxHeight = (panel.scrollHeight + 30) + "px";
    const arrow = document.getElementById(this.arrowId)
    if (arrow) arrow.style.transition = 'unset'
  }

  toggle(): void {
    this.accordianOpen = !this.accordianOpen
    this._climatePriceService.toggleAccordian(this.panelId, this.arrowId)
  }

  selectAll(control, list) {
    this.filters.get(control).setValue(this.assetFilters[list])
  }

  unSelectAll(control) {
    this.filters.get(control).setValue([])
  }

  patchValues({ file = false, tier2 = false, tier3 = false, tier4 = false, country = '', state = [], city = [], asset_class = [] }) {
    if (this.shareableLink) return;
    this.filters.patchValue({
      selectedTierOne: file || false,
      selectedTierTwo: tier2 || false,
      selectedTierThree: tier3 || false,
      selectedTierFour: tier4 || false,
      selectedCountry: country,
      selectedStates: state,
      selectedCities: city,
      selectedPropetryTypes: asset_class
    })
  }

  async getAssetFilters() {
    try {
      this.apiCallInProgress = true
      this.assetFilters = await this._climatePriceService.getAssetFilters({
        tier_4: this.payLaodTier4,
        country: this.filters.value.selectedCountry,
        state: this.filters.value.selectedStates,
        city: this.filters.value.selectedCities,
        assetClass: this.filters.value.selectedPropetryTypes,
      })
      this.apiCallInProgress = false
      // return this.assetFilters
    } catch (e) { console.log(e) }
  }

  get payLaodTier4() {
    let tierFourIds;
    if (this.filters.value.selectedTierFour) {
      tierFourIds = [this.filters.value.selectedTierFour]
    } else {
      // if any of the first three tier is selected , we will send ids of tier4 as an array otherwise an empty array
      const isAnyTeirSelected = [this.filters.value.selectedTierOne, this.filters.value.selectedTierTwo, this.filters.value.selectedTierThree].some(Boolean)
      tierFourIds = isAnyTeirSelected ? Array.from(this.tiersDropdownsComponent.tierFourList, ({ uuid }) => uuid) : []
    }
    return tierFourIds
  }

  async ResetAllFilters() {
    this.patchValues({})
    await this.tiersDropdownsComponent.loadFilters()
    await this._climatePriceService.deleteFilters()
  }

  applyFilter() {
    if (!this.apiCallInProgress) {
      this.ApplyFilter.next()
      if (!window.location.search.includes(AppConstants.Public_Link_Key)) {
        this._appService.filters = { ...this.filters.value, tier_4: this.payLaodTier4 }
      }
    }
  }

  popoverInputKeyup() {
    if (this.comparisonName.length) {
      document.getElementById('popover-comparison-name-input').classList.remove('invalid')
      document.getElementById('comparison-popover-error-msg').classList.remove('d-block')
    }
  }

  saveComparison() {
    if (!this.comparisonName.length) return;
    let comparisonTitles = this._climatePriceService.getComparisonList()?.map(m => m.title)
    if (comparisonTitles?.includes(this.comparisonName.trim())) {
      document.getElementById('popover-comparison-name-input').classList.add('invalid')
      document.getElementById('comparison-popover-error-msg').classList.add('d-block')
      return;
    } else {
      document.getElementById('popover-comparison-name-input').classList.remove('invalid')
      document.getElementById('comparison-popover-error-msg').classList.remove('d-block')
    }
    this.popover.close()
    this.AddToComparison.next()
  }

  resetComparisonName = () => this.comparisonName = ''

  get isSaveCurrentFilterBtnDisabled() {
    const values = this.filters.value
    const tier1 = !values.selectedTierOne
    const tier2 = this.filters.controls['selectedTierTwo'].disabled || !values.selectedTierTwo
    const tier3 = this.filters.controls['selectedTierThree'].disabled || !values.selectedTierThree
    const tier4 = this.filters.controls['selectedTierFour'].disabled || !values.selectedTierFour
    return [tier1, tier2, tier3, tier4].every(m => m == true) &&
      [values.selectedCities, values.selectedStates, values.selectedPropetryTypes].every(m => !m?.length) && values.selectedCountry == ''
  }




}
