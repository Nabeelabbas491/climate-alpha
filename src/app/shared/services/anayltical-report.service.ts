import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AnaylticalReportService {

  constructor(private api: ApiService) { }

  getAnalyticalReportData(userId, portfolio_id,country) {
    let url = userId ? `client/analytical_report?user_id=${userId}&portfolio_id=${portfolio_id}&country=${country}` : `client/analytical_report?portfolio_id=${portfolio_id}&country=${country}`
    return new Promise((resolve, reject) => {
      this.api.get(url).subscribe((response) => {
        resolve(response)
      }, (error) => {
        let err = error.body ? error.body : error.error;
        reject({ ...err, 'http_status': error.status })
      })
    })
  }
}
