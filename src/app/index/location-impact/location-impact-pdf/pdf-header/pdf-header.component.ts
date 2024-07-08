import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pdf-header',
  templateUrl: './pdf-header.component.html',
  styleUrls: ['../location-impact-pdf.component.scss', './pdf-header.component.scss']
})
export class PdfHeaderComponent {
  @Input() title: string = ''
}
