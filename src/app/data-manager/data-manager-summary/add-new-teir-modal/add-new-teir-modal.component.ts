import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AssetFiltersComponent } from 'app/climate-price/multiple-properties/asset-filters/asset-filters.component';
@Component({
  selector: 'app-add-new-teir-modal',
  templateUrl: './add-new-teir-modal.component.html',
  styleUrls: ['./add-new-teir-modal.component.scss']
})
export class AddNewTeirModalComponent extends AssetFiltersComponent {

  @ViewChild('modal') modalRef: ElementRef
  @Output() AddRow = new EventEmitter();
  tierHeadings: Object;
  columnClass: string = 'col-12';
  checkBoxTier1: boolean = false
  checkBoxTier2: boolean = false
  checkBoxTier3: boolean = false
  checkBoxTier4: boolean = false
  disableConfirmBtn: boolean = true

  initializeForm() {
    this.filters = this._fb.group({
      selectedTierOne: new FormControl(""),
      selectedTierTwo: new FormControl(""),
      selectedTierThree: new FormControl(""),
    })
    this.filters.valueChanges.subscribe(form => this.onFormChange(form))
  }

  onFormChange(f) {
    if (this.checkBoxTier1) {
      this.disableConfirmBtn = !this.checkBoxTier1
    } else if (this.checkBoxTier2) {
      this.disableConfirmBtn = !f.selectedTierOne
    } else if (this.checkBoxTier3) {
      this.disableConfirmBtn = !f.selectedTierOne || (!f.selectedTierTwo && 'selectedTierTwo' in f)
    } else if (this.checkBoxTier4) {
      this.disableConfirmBtn = !f.selectedTierOne || (!f.selectedTierTwo && 'selectedTierTwo' in f) || (!f.selectedTierThree && 'selectedTierThree' in f)
    } else {
      this.disableConfirmBtn = true
    }
  }

  patchValues({ file, tier2, tier3, tier4, country, state, city, asset_class }) {
    this.filters.patchValue({
      selectedTierOne: !file ? "" : file,
      selectedTierTwo: !tier2 ? "" : tier2,
      selectedTierThree: !tier3 ? "" : tier3
    })
  }

  onCheckBoxSelection(tierType) {
    switch (tierType) {
      case 'Tier 1':
        this.columnClass = 'col-12'
        this.checkBoxTier2 = false, this.checkBoxTier3 = false, this.checkBoxTier4 = false
        this.filters.patchValue({ selectedTierOne: "", selectedTierTwo: "", selectedTierThree: "" })
        break;
      case 'Tier 2':
        this.columnClass = 'col-12'
        this.checkBoxTier1 = false, this.checkBoxTier3 = false, this.checkBoxTier4 = false
        this.filters.patchValue({ selectedTierTwo: "", selectedTierThree: "" })
        break;
      case 'Tier 3':
        this.columnClass = 'col-md-6'
        this.checkBoxTier1 = false, this.checkBoxTier2 = false, this.checkBoxTier4 = false
        this.filters.patchValue({ selectedTierThree: "" })
        break;
      case 'Tier 4':
        this.columnClass = 'col-md-4'
        this.checkBoxTier1 = false, this.checkBoxTier2 = false, this.checkBoxTier3 = false
        break;
    }
    this.onFormChange(this.filters.value)
  }

  async openModal(content) {
    this._modalService.open(content, {
      size: 'xl',
      ariaLabelledBy: 'modal-basic-title',
      scrollable: true,
      // backdrop: 'static',
      keyboard: false,
      centered: true
    }).result.then((result) => {
      setTimeout(() => {
        console.log("rcds", this.tiersDropdownsComponent)
      });
    }, (reason) => { });
  }

  closeModal() {
    this._modalService.dismissAll()
  }

  confirmModal() {
    if (this.disableConfirmBtn) return;
    // output event to summary table with selected ids
    this.AddRow.next(this.filters.value)
    this.closeModal()
  }

}


