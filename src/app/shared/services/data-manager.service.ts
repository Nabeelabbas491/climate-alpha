import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DataManagerService {

  constructor(private _apiService: ApiService) { }

  deleteProperty(uuid) {
    return new Promise((resolve, reject) => {
      this._apiService.post(`client/delete_property`, uuid).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
  }

  addNewProperty(data) {
    return new Promise((resolve, reject) => {
      this._apiService.post(`client/add_property_to_portfolio`, data).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
  }

  updateProperty(data) {
    return new Promise((resolve, reject) => {
      this._apiService.post(`client/update_assets/`, data).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
  }

  // called by _apiService-data-table
  getUserApiDataListing(page_number, query = '', page_size, filters = undefined, sortOrder, sortBy) {
    const body = {
      page: page_number,
      page_size: page_size,
      order_type: sortOrder,
      order_by: sortBy,
      q: query,
      ...filters
    }
    return new Promise((resolve, reject) => {
      this._apiService.post('client/data/', body).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error.body)
      })
    })
  }

  getPropertyTypes() {
    return new Promise((resolve, reject) => {
      this._apiService.get(`client/property_types`).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error.error)
      })
    })
  }

  getUserFiles() {
    return new Promise((resolve, reject) => {
      this._apiService.get(`client/files/`).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error.error)
      })
    })
  }

  uploadFile(formData) {
    return new Promise((resolve, reject) => {
      this._apiService.post("client/files/", formData).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error.error)
      })
    })
  }

}
