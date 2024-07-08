import { Injectable } from '@angular/core';
import { PDFfilters } from 'app/standalone-components/download-pdf/download-pdf.component';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClimateAlphaService {

  public activeSiderBarItem$ = new BehaviorSubject<any>(undefined);
  public pdfReportFilters$ = new BehaviorSubject<PDFfilters | undefined>(undefined);

}
