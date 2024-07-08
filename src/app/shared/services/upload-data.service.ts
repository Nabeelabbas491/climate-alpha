import { Injectable } from '@angular/core';
// import { DataPortal } from 'app/data-upload/Utils';
import { ApiService } from './api.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadDataService {

  portfolio_id = '';
  public assetTableObs$ = new BehaviorSubject<any>(undefined);

  constructor(private api: ApiService) {

  }

  uploadFile(formData) {
    return new Promise((resolve, reject) => {
      this.api.post("client/files/", formData).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
  }

}
