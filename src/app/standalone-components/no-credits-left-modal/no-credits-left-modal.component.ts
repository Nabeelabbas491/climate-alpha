import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-no-credits-left-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './no-credits-left-modal.component.html',
  styleUrls: ['./no-credits-left-modal.component.scss']
})
export class NoCreditsLeftModalComponent {

  @ViewChild('modal') modalRef: ElementRef

  constructor(private modalService: NgbModal) { }

  openModal() {
    this.modalService.open(this.modalRef, {
      size: 'xl',
      ariaLabelledBy: 'modal-basic-title',
      scrollable: true,
      backdrop: true,
      centered: true
    }).result.then((result) => { }, (reason) => { });
  }

  closeModal() { this.modalService.dismissAll() }

}
