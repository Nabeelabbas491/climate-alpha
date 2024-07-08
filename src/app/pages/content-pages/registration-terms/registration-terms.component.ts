import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-registration-terms',
  templateUrl: './registration-terms.component.html',
  styleUrls: ['./registration-terms.component.scss']
})
export class RegistrationTermsComponent {
  @ViewChild('modalterms') modalRef: ElementRef
  constructor( private modalService: NgbModal) { }

  openModal(content){
    this.modalService.open(content, {
      size: 'xxl',
      ariaLabelledBy: 'modal-basic-title',
      scrollable: true,
      backdrop : 'static',
      keyboard : false,
      centered: true
    }).result.then((result) => { }, (reason) => { });
  }
  
  closeModal() {
    this.modalService.dismissAll()
  }
}
