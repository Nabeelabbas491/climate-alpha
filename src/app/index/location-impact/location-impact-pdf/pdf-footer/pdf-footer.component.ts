import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pdf-footer',
  templateUrl: './pdf-footer.component.html',
  styleUrls: ['../location-impact-pdf.component.scss', './pdf-footer.component.scss']
})
export class PdfFooterComponent {

  @Input() pageNumber: number

}
