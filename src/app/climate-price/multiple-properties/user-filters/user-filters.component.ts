import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserFilter } from 'app/climate-price/climate-price.interface';
import { ClimatePriceService } from 'app/shared/services/climate-price.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-filters',
  templateUrl: './user-filters.component.html',
  styleUrls: ['../asset-filters/asset-filters.component.scss']
})
export class UserFiltersComponent {

  @ViewChild('createNewFilter') createNewFilterModal: ElementRef
  @ViewChild('savedFilters') savedFiltersModal: ElementRef
  @Output() LoadFilter = new EventEmitter();
  @Input() form: FormGroup = new FormGroup({});
  @Input() totalAssets: any;
  filtersList: UserFilter[];
  filterName: string = ''

  constructor(private _climatePriceService: ClimatePriceService,
    private _modalService: NgbModal,
    public _toastr: ToastrService,
  ) { }

  async getFiltersList() {
    try {
      this.filtersList = await this._climatePriceService.getUserSavedFilters()
      this.filtersList = this.filtersList.map((item) => { return { ...item, selected: false } })
    } catch (e) { }
  }

  async openModal(modalRef) {
    await this.getFiltersList()
    await this._modalService.open(modalRef, {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title',
      scrollable: true,
      // backdrop: 'static',
      keyboard: false,
      centered: true
    })
    setTimeout(() => {
      const element = document.getElementById('filters-container')
      if (element) {
        element.offsetHeight >= 200 ? element.classList.add("over-flow") : element.classList.remove('over-flow')
      }
    })
  }

  async saveFilter() {
    try {
      if (!this.filterName.length) return;
      let body = {
        name: this.filterName,
        file: this.form.value.selectedTierOne || null,
        tier2: this.form.value.selectedTierTwo || null,
        tier3: this.form.value.selectedTierThree || null,
        tier4: this.form.value.selectedTierFour || null,
        country: this.form.value.selectedCountry,
        state: this.form.value.selectedStates,
        city: this.form.value.selectedCities,
        asset_class: this.form.value.selectedPropetryTypes,
        assets_count: this.totalAssets
      }
      await this._climatePriceService.saveFilter(body)
      this._toastr.success("Your filter saved successfully!");
      this.filterName = ''
      this.closeModal()
    } catch (e) {
      this._toastr.error(e);
    }
  }

  onCheckBoxChange(item, event) {
    this.filtersList = this.filtersList.map((m) => { return { ...m, selected: item.uuid == m.uuid ? event.target.checked : false } })
    const loadBtn = document.getElementById("loadFilterBtn")
    if (this.filtersList.findIndex(_ => _.selected) > -1) {
      loadBtn.classList.remove('disabled')
    } else {
      loadBtn.classList.add('disabled')
    }
  }

  async loadSelectedFilter() {
    const item: Object = this.filtersList.find(_ => _.selected)
    if (!item) return;
    this.LoadFilter.next(item)
    this.closeModal()
  }

  async deleteFilter(item, idx) {
    try {
      await this._climatePriceService.deleteFilter(item.uuid)
      this.filtersList.splice(idx, 1)
      this._toastr.success('Filter deleted successfully')
    } catch (e) { console.log(e) }
  }

  closeModal() {
    this._modalService.dismissAll()
  }

}
