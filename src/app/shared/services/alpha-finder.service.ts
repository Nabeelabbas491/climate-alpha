import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AlphaFinderService {

  selectedSavedSearch;
  constructor(private _api: ApiService) { }

  getAlphaFinderCategories({ country = 'US' }) {
    let url = `alpha_finder/categories?country=${country}`
    return new Promise((resolve, reject) => {
      this._api.get(url).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
  }

  saveSelectedFeatures(data) {
    let url = `alpha_finder/user_search/`
    return new Promise((resolve, reject) => {
      this._api.post(url, data).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(JSON.parse(error._body))
      })
    })
  }

  updateSelectedFeatures(data, id) {
    let url = `alpha_finder/user_search/${id}/?country=${data.country}`
    return new Promise((resolve, reject) => {
      this._api.patch(url, data).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(JSON.parse(error._body))
      })
    })
  }

  getSavedFeatures({ country }) {
    let url = `alpha_finder/user_search?country=${country}`
    return new Promise((resolve, reject) => {
      this._api.get(url).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(JSON.parse(error._body))
      })
    })
  }

  deleteSavedFeature(id, country) {
    let url = `alpha_finder/user_search/${id}/?country=${country}`
    return new Promise((resolve, reject) => {
      this._api.delete(url).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(JSON.parse(error._body))
      })
    })
  }

  geTopTwentyFiveCounties(data) {
    let url = `alpha_finder/search/`
    return new Promise((resolve, reject) => {
      this._api.post(url, data).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject((error))
      })
    })
  }

  getAlphaSearchCanada(data) {
    let url = `alpha_finder/search/ca`
    return new Promise((resolve, reject) => {
      this._api.post(url, data).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject((error))
      })
    })
  }

  setExportedData(exportData) {
    localStorage.setItem('alpha-finder-selected-items', JSON.stringify(exportData))
  }

  getExportedData() {
    let data = JSON.parse(localStorage.getItem('alpha-finder-selected-items'))
    return data
  }

  setItem(data) {
    localStorage.setItem('alpha-finder', JSON.stringify(data))
  }

  getItem() {
    return JSON.parse(localStorage.getItem('alpha-finder'))
  }

  removeItem() {
    localStorage.removeItem('alpha-finder')
  }

}
