import { Component, OnInit, Input } from "@angular/core";
import * as FileSaver from "file-saver";
import { ToastrService } from "ngx-toastr";

import { AppConstants } from "app/shared/data/constants";
import { DownloadChartService } from "app/shared/services/download-chart-service";
import { AuthService } from "app/shared/services/auth.service";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: "app-download-chart",
  templateUrl: "./download-chart.component.html",
  styleUrls: ["./download-chart.component.scss"],
})
export class DownloadChartComponent implements OnInit {

  @Input() endpoint: string = "";
  @Input() filters: any = {};
  @Input() responseType: string = 'text';
  @Input() validateParams: boolean = true;
  downloadIcon: string = AppConstants.DOWNLOAD;
  publicLink = false

  constructor(
    private downloadChart: DownloadChartService,
    private toastr: ToastrService,
    private authService: AuthService,
    private spinner: NgxSpinnerService,

  ) {
  }

  ngOnInit() {
    this.publicLink = this.authService.isPublicLink()
  }

  mouseIn() {
    this.downloadIcon = AppConstants.DOWNLOAD_HOVER;
  }

  mouseOut() {
    this.downloadIcon = AppConstants.DOWNLOAD;
  }

  async chartDownload() {
    try {
      this.spinner.show('data_download');
      let file_type_options = {
        'text': {
          'blob_type': 'text/csv',
          'ext': 'csv'
        },
        'arraybuffer': {
          'blob_type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
          'ext': 'xlsx'
        },
        'blob': {
          'blob_type': 'application/zip',
          'ext': 'zip'
        }
      }
      var self = this;
      var get_csv = false;
      // To check if user has selected any CBSA or county
      for (var key in this.filters) {
        if (this.filters.hasOwnProperty(key)) {
          if (this.filters[key].length > 0) {
            get_csv = true;
            break;
          }
        }
      }
      if (this.filters.selected_counties && this.filters.selected_counties.length <= 0) get_csv = false;
      if (get_csv || !this.validateParams) {
        let blob;
        let response: any = [];
        response = await this.downloadChart.getCSVDownload({
          end_point: this.endpoint,
          filters: this.filters,
        }, self.responseType);
        blob = new Blob([response], { type: file_type_options[self.responseType].blob_type });
        let file_name = `AlphaGeo-${AppConstants.getRandomInt(0, 1000)}`;
        if (self.responseType == 'arraybuffer' || self.responseType == 'blob') file_name = `${this.filters.portfolio_name} results`;
        FileSaver.saveAs(
          blob,
          `${file_name}.${file_type_options[self.responseType].ext}`
        );
      }
      else {
        this.toastr.warning("Please select the county/CBSA first!");
      }
      this.spinner.hide('data_download');
    } catch (error) {
      this.spinner.hide('data_download');
      return this.toastr.error("Error", error.message);
    }
  }
}
