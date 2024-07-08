import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TiersDropdownsComponent } from 'app/standalone-components/tiers-dropdowns/tiers-dropdowns.component';
import { LALocation } from '../location-analytics.interface';
import { DataManagerService } from 'app/shared/services/data-manager.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-to-portfolio-modal',
  templateUrl: './add-to-portfolio-modal.component.html',
  styleUrls: ['./add-to-portfolio-modal.component.scss']
})
export class AddToPortfolioModalComponent implements OnInit {

  @ViewChild(TiersDropdownsComponent) tiersDropdownsComponent: TiersDropdownsComponent
  @ViewChild('modal') modalRef: ElementRef
  form: FormGroup;
  location: LALocation;
  isPortfolioUploaded: boolean = false

  constructor(private _modalService: NgbModal,
    public _fb: FormBuilder,
    private _dataManagerService: DataManagerService,
    private toastr: ToastrService) { this.initializeForm() }

  ngOnInit(): void { }

  initializeForm() {
    this.form = this._fb.group({
      selectedTierOne: new FormControl(''),
      selectedTierTwo: new FormControl(''),
      selectedTierThree: new FormControl(''),
      selectedTierFour: new FormControl(''),
    })
  }

  async openModal(selectedLocation) {
    this.location = selectedLocation
    this._modalService.open(this.modalRef, {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title',
      scrollable: true,
      // backdrop: 'static',
      keyboard: false,
      centered: true
    })
  }

  closeModal() {
    this._modalService.dismissAll()
  }

  async confirm() {
    try {
      if (!this.form.value.selectedTierOne) return;
      const body = {
        "portfolio": this.form.value.selectedTierOne || '',
        "state": this.location.state,
        "address": this.location.name,
        "zip_code": this.location.zip_code,
        "city": this.location.city,
        "asset_type": "",
        "latitude": this.location.latlng[0],
        "longitude": this.location.latlng[1],
        "country": this.location.country,
        "t2_id": this.form.value.selectedTierTwo || '',
        "t3_id": this.form.value.selectedTierThree || '',
        "t4_id": this.form.value.selectedTierFour || ''
      }
      await this._dataManagerService.addNewProperty(body)
      this.closeModal()
      this.toastr.success('Property added')
    } catch (e) {
      console.log(e)
      if (e.status == 422 || e.status == 500) this.toastr.error(e.error.message)
    }
  }

}
