import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppConstants } from 'app/shared/data/constants';
import { environment } from 'environments/environment';
import * as FileSaver from "file-saver";
import { DownloadPDF } from 'app/shared/services/download.service';
import { AuthService } from 'app/shared/services/auth.service';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ClimateAlphaService } from 'app/shared/services/climatealpha.service';

@Component({
  selector: 'app-download-pdf',
  standalone: true,
  imports: [CommonModule, NgbTooltipModule],
  templateUrl: './download-pdf.component.html',
  styleUrls: ['./download-pdf.component.scss']
})

export class DownloadPdfComponent {

  @Input() permissions;
  @Input() filters: any;
  @Input() endPoint: string = 'api/pdf';
  // @Input() showButtonUI: boolean = false
  downloadIcon: string = AppConstants.DOWNLOAD;
  pdfDownloadInProgress: boolean = false
  disableButtonsMsg = AppConstants.PA_DOWNLOAD_BUTTONS_MSG

  constructor(private _downlaodPDFService: DownloadPDF,
    private _authService: AuthService,
    private _toastr: ToastrService) { }

  // mouseIn() { this.downloadIcon = AppConstants.DOWNLOAD_HOVER }

  // mouseOut() { this.downloadIcon = AppConstants.DOWNLOAD }

  async pdfDownload() {
    try {
      if (this.pdfDownloadInProgress || !this.filters) return;
      this.pdfDownloadInProgress = true
      let blob;
      let response: any = await this.getPDF();
      blob = new Blob([response], { type: "application/pdf" });
      var blobURL = URL.createObjectURL(blob);
      // `AlphaGeo-${AppConstants.getRandomInt(0, 1000)}.pdf`
      FileSaver.saveAs(blob, `${this.filters.reportName}.pdf`);
      this.pdfDownloadInProgress = false
      this._toastr.success("Your pdf report has been downloaded successfully!")
    }
    catch (error) {
      console.log(error)
      this.pdfDownloadInProgress = false
      this._toastr.error("Sorry! There is some error downloading your report. Please try again.")
    }
  }

  getPDF() {
    const filters = {
      ...this.filters,
      loginUrl: `${environment.FRONTEND_URL}login`,
      targetUrl: `${environment.FRONTEND_URL}${this.filters.pathname}${this.filters.pathname.includes('?') ? '&' : '?'}userId=${this._authService.admin.id}`,
    }
    return new Promise((resolve, reject) => {
      this._downlaodPDFService.post(`${this.endPoint}/`, filters).subscribe((response) => { resolve(response.body) },
        (error) => { reject(error) }
      );
    });
  }

}

export interface PDFfilters {
  pathname: string,
  data: Object,
  reportName: string
}
