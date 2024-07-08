import { Component, EventEmitter, Injectable, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { DataManager } from 'app/data-manager/data-manager.utils';
import { DataManagerService } from 'app/shared/services/data-manager.service';
import { ToastrService } from 'ngx-toastr';
import { ClimatePriceService } from 'app/shared/services/climate-price.service';

@Component({
  selector: 'app-create-portfolio-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-portfolio-dialog.component.html',
  styleUrls: ['./create-portfolio-dialog.component.scss']
})
export class CreatePortfolioDialogComponent {

  @Injectable()
  @Input() public modalConfig: any
  @Output() result: EventEmitter<any> = new EventEmitter();
  @ViewChild('newTier1Modal') private modalContent: TemplateRef<CreatePortfolioDialogComponent>
  private modalRef: NgbModalRef
  name: string = ''
  description: string = '';

  constructor(private modalService: NgbModal,
    private toastr: ToastrService,
    private _climatePriceService: ClimatePriceService) { }

  open() {
    this.modalRef = this.modalService.open(this.modalContent, {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title',
      scrollable: true,
      backdrop: 'static',
      centered: true
    })
    this.modalRef.result.then((result) => { }, (reason) => { })
  }

  async submit() {
    try {
      if (!this.name.length) return;
      const body = { tier_number: 1, name: this.name, parent_id: null, description: this.description }
      const response: any = await this._climatePriceService.createNewTier(body)
      this.result.emit({ ...response, portfolio_name: response['name'] })
      this.toastr.success("Tier 1 created successfully!")
      this.name = ''
      this.modalRef.close()
    }
    catch (e) { }
  }

  dismiss() {
    this.modalRef.close()
    this.name = null
    this.description = null
    this.result.emit(false)
  }

}
