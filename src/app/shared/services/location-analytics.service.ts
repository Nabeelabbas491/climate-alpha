import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { GlobalPhysicalImpact, LALocation, LAResponse, LocationAnalyticsResponse } from 'app/location-analytic/location-analytics.interface';
import { GlobalOverview } from 'app/index/index-interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationAnalyticsService {

  constructor(private _apiService: ApiService) { }

  getLocations(query): Promise<LALocation[]> {
    return new Promise((resolve, reject) => {
      this._apiService.get(`location_explorer/search?q=${query}`).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error.error)
      })
    })
  }

  getLocationAnalysisDataObs(data): Observable<LocationAnalyticsResponse> {
    return this._apiService.post(`location_explorer/results/`, data)
  }

  getLocationAnalysisData(data): Promise<LocationAnalyticsResponse> {
    return new Promise((resolve, reject) => {
      this._apiService.post(`location_explorer/results/`, data).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
  }

  getLocationDetails(latitude, longitude, zoom_level): Promise<LALocation> {
    return new Promise((resolve, reject) => {
      this._apiService.get(`location_explorer/details?latitude=${latitude}&longitude=${longitude}&zoom_level=${zoom_level}`).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error.error)
      })
    })
  }

  saveTrialUserSearchedLocation(payload) {
    return this._apiService.post('location_explorer/places/', payload).toPromise()
  }

  getTrialUserSavedLocations() {
    return this._apiService.get('location_explorer/places/').toPromise()
  }

}
