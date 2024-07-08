import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { LALocation, LocationAnalyticsResponse } from '../location-analytics.interface';
import { LocationAnalyticsService } from 'app/shared/services/location-analytics.service';
import { ToastrService } from 'ngx-toastr';
import { IndexConstants } from 'app/index/index-constants';
import { ClimatePriceService } from 'app/shared/services/climate-price.service';
import { AuthService } from 'app/shared/services/auth.service';
import { NoCreditsLeftModalComponent } from 'app/standalone-components/no-credits-left-modal/no-credits-left-modal.component';

@Component({
  selector: 'app-location-search',
  templateUrl: './location-search.component.html',
  styleUrls: ['./location-search.component.scss']
})
export class LocationSearchComponent implements OnInit, AfterViewInit {

  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  @ViewChild(NoCreditsLeftModalComponent) noCreditsLeftModalComponent: NoCreditsLeftModalComponent
  @Output() Response = new EventEmitter<{ response: LocationAnalyticsResponse, selectedLocation: LALocation, scenario: string }>()
  @Output() RemoveLocation = new EventEmitter<LALocation>()
  @Output() Error = new EventEmitter<LALocation>()
  @Input() isTrialUser;
  @Input() trialUserData;
  input: string = ''
  searchStatus: string = '';
  allowedLocationsLimit: number = 6;
  limitMsg: string = 'Only six locations are allowed at a time!'
  searchResult: Array<LALocation> = [];
  selectedLocations: Array<LALocation> = [];
  analysisInProgress: boolean = false
  selectedScenario = IndexConstants.DefaultScenario

  constructor(private _locationAnalyticsService: LocationAnalyticsService,
    private _climatePriceService: ClimatePriceService,
    private _authService: AuthService,
    private _taostr: ToastrService) {
  }

  ngOnInit(): void {
    document.addEventListener('click', ($event) => {
      if ($event.target['id'] != 'search-input') {
        document.getElementsByClassName("search-result-container")[0]?.setAttribute('style', 'display : none')
        this.input = ''
      }
    })
  }

  ngAfterViewInit(): void {
    this.searchInput.nativeElement.focus()
  }

  async search(): Promise<void> {
    try {
      if (this.input.length > 1) {
        document.getElementsByClassName("search-result-container")[0]?.setAttribute('style', 'display : revert')
        this.searchStatus = 'searching...'
        this.searchResult = await this._locationAnalyticsService.getLocations(this.input)
        this.searchResult = this.searchResult.map((m) => { return { ...this.transformLocationObject(m) } })
        this.searchStatus = this.searchResult.length ? '' : 'No results found!'
      }
    } catch (e) { }
  }

  transformLocationObject(m) {
    return {
      ...m,
      added: false,
      disabled: false,
      showTooltip: false,
      sortOrder: 'asc',
      showSpinner: false,
      identifier: this.getIdentifier(m.latlng),
      checked: this.selectedLocations?.findIndex(_ => _.identifier == this.getIdentifier(m.latlng)) > -1,
    }
  }

  getIdentifier(latLng: Array<number>) {
    return latLng?.join(", ")
  }

  async addLocation(item: LALocation) {
    try {
      if (this.analysisInProgress) return;
      if (this.selectedLocations.find(_ => _.identifier == item.identifier)) return;
      const locations = structuredClone(this.selectedLocations)
      const index = locations.findIndex(_ => _.identifier == item.identifier)
      if (item.checked) {
        if (locations.length > this.allowedLocationsLimit - 1) {
          item.checked = false
          this.isTrialUser ? this.noCreditsLeftModalComponent.openModal() : this._taostr.error(this.limitMsg)
          return
        }
        if (index == -1) locations.push(structuredClone(item))
        this.analysisInProgress = true
        item.showSpinner = true
        this.searchResult.forEach((m) => { m.disabled = item.identifier == m.identifier ? false : true })
        const payLoad = this.getAPIpayload(item, this.selectedScenario)
        let response: LocationAnalyticsResponse = await this._locationAnalyticsService.getLocationAnalysisData(payLoad)
        const benchMark: any = await this._climatePriceService.getRiskBenchMark(IndexConstants.getBenchMarkParams({ h306: response.h3_06, scenario: this.selectedScenario }))
        if (this.isTrialUser) {
          let payload: Object = { latitude: item.latlng[0], longitude: item.latlng[1], name: item.name, city: item.city, zip_code: item.zip_code, country: item.country }
          if (item.shapefile) payload = { ...payload, shapefile: item.shapefile }
          var savedLocationRes = await this._locationAnalyticsService.saveTrialUserSearchedLocation(payload)
        }
        if (index == -1) { this.selectedLocations.push(structuredClone({ ...item, added: true })) } else { this.selectedLocations[index].added = true }
        this.selectedLocations = this.selectedLocations.map((m) => { return { ...m, showSpinner: false } })
        item.showSpinner = false
        this.searchResult.forEach((m) => { m.disabled = false })
        let data = { response: { ...response, benchMark: benchMark }, selectedLocation: item, scenario: this.selectedScenario }
        if (this.isTrialUser) {
          data['creditsUsed'] = savedLocationRes.credits_used
          if (Object.keys(savedLocationRes).length) {
            const latlng = [savedLocationRes.places.latitude, savedLocationRes.places.longitude]
            data['savedTrialLocation'] = { ...item, ...savedLocationRes.places, identifier: this.getIdentifier(latlng) }
          }
        }
        this.Response.next(data)
        this.analysisInProgress = false
      }
      else {
        this.RemoveLocation.next(item)
      }
    }
    catch (e) {
      this.analysisInProgress = false;
      item.checked = false, item.showSpinner = false
      this.searchResult = this.searchResult.map((m) => { return { ...m, disabled: false } })
      if (e.status == 422) {
        !this.isTrialUser && this._taostr.error(e.error.message)
        this.isTrialUser && this.noCreditsLeftModalComponent.openModal()
      } else {
        this.Error.next()
      }
    }
  }

  getAPIpayload(item, scenario) {
    let payLoad: any = item.bbox?.length ? { locations: item.bbox, bbox: true, } : { locations: [item.latlng] }
    payLoad = { ...payLoad, scenario: scenario, state: item.state }
    if (this.isTrialUser) {
      const data = this.trialUserData?.places?.find(_ => _.identifier == item.identifier);
      payLoad.saved_location_id = data?.id
    }
    return payLoad
  }

}
