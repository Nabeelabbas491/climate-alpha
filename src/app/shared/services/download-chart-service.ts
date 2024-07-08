import { Injectable } from "@angular/core";

import { DownloadService } from "./download.service";
import { DownloadPDF } from "./download.service";
import { AuthService } from "./auth.service";
import { ApiService } from "./api.service";

@Injectable()
export class DownloadChartService {
  constructor(
    private authService: AuthService,
    private downloadService: DownloadService,
    private _apiService: ApiService
  ) { }

  getCSVDownload({ end_point = "", filters = {} }, responseType = 'text') {
    return new Promise((resolve, reject) => {
      var url = `${end_point}?`;
      for (const filter in filters) {
        url = url + filter + '=' + filters[filter] + '&';
      }
      this.downloadService
        .get(
          url,
          responseType
        )
        .subscribe(
          (response) => {
            resolve(response.body);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  postCSVDownlaod({ end_point = "", filters = {} }) {
    return new Promise((resolve, reject) => {
      this.downloadService
        .post(
          end_point,
          filters
        )
        .subscribe(
          (response) => {
            resolve(response.body);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
}

@Injectable()
export class DownloadPDFService {
  constructor(
    private api: ApiService,
    private downloadPdf: DownloadPDF,
    private downloadService: DownloadService
  ) { }

  generateReport({ end_point = "", filters = {} }) {
    return new Promise((resolve, reject) => {
      this.api
        .post(
          end_point,
          filters
        )
        .subscribe(
          (response) => {
            resolve(response.body);
          },
          (error) => {
            reject(JSON.parse(error));
          }
        );
    });
  }

  getPDF({ end_point = "", filters = {} }) {
    return new Promise((resolve, reject) => {
      this.downloadPdf
        .post(
          end_point,
          filters
        )
        .subscribe(
          (response) => {
            resolve(response.body);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
}



