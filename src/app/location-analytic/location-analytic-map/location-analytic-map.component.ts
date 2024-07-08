import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AppConstants } from 'app/shared/data/constants';
import {
  ActivatedRoute,
} from '@angular/router';
import * as L from "leaflet";
import { LocationAnalyticTableComponent } from '../location-analytic-table/location-analytic-table.component';
import { LALocation } from '../location-analytics.interface';
import { SelectedLocationsBar } from '../selected-locations-bar/selected-locations-bar.component';
import { LocationSearchComponent } from '../location-search/location-search.component';
import { LocationAnalyticsService } from 'app/shared/services/location-analytics.service';
import { GlobalOverviewComponent } from 'app/index/global-overview/global-overview.component';
import { ClimatePrice } from 'app/climate-price/climate-price.utils';
import { ToastrService } from 'ngx-toastr';
import { ClimateAlphaService } from 'app/shared/services/climatealpha.service';
import { IndexConstants } from 'app/index/index-constants';
import { ClimatePriceService } from 'app/shared/services/climate-price.service';
import { AuthService } from 'app/shared/services/auth.service';
@Component({
  selector: 'app-location-analytic-map',
  templateUrl: './location-analytic-map.component.html',
  styleUrls: ['./location-analytic-map.component.scss']
})
export class LocationAnalyticMapComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(LocationSearchComponent, { static: true }) locationSearchComponent: LocationSearchComponent
  @ViewChild(GlobalOverviewComponent) globalOverviewComponent: GlobalOverviewComponent
  @ViewChild('leafletMap', { static: true }) private mapElement: ElementRef;
  @ViewChild(LocationAnalyticTableComponent) tableComponent: LocationAnalyticTableComponent
  @ViewChild(SelectedLocationsBar) selectedLocationsBarComponent: SelectedLocationsBar
  initialZoom: number = 2;
  modal: boolean = false
  mapView: Array<number> = ClimatePrice.GlobalMapView;
  map: any;
  markersLayer: any;
  polygonLayer: any;
  hexLayer: any;
  mapboxAccessToken: string = AppConstants.MAPBOX_ACCESS_TOKEN;
  apiInProgress: boolean = false;
  unAddedLocation = undefined
  isTrialUser: boolean;
  trialUserData;

  constructor(private _locationAnalyticService: LocationAnalyticsService,
    private _climatealphaService: ClimateAlphaService,
    private _climatePriceService: ClimatePriceService,
    private _taostr: ToastrService,
    private _cdr: ChangeDetectorRef,
    private _authService: AuthService,
    private route: ActivatedRoute) {
    this.isTrialUser = this._authService.isLocationExplorerTrialUser()
  }

  async ngOnInit() {
    this.loadMap();
    if ('latitude' in this.route.params['value']) {
      const latitude = this.route.params['value']['latitude'];
      const longitude = this.route.params['value']['longitude'];
      const zoom = this.route.params['value']['zoom'];
      const e = { latlng: { 'lat': latitude, 'lng': longitude } }
      await this.onMapClick(e, zoom)
      let id = this.locationSearchComponent.getIdentifier([latitude, longitude])
      this.onTooltipButtonClick(id)
    }
    if (this.isTrialUser) await this.loadTrialUserLocations()
  }

  loadMap(): void {
    /** loading map  mapbox://styles/v1/mehroz/clilc0kcv00h601r13duj1k06*/
    // World map bounds
    var southWest = L.latLng(-89.98155760646617, -180),
      northEast = L.latLng(89.99346179538875, 180);
    var bounds = L.latLngBounds(southWest, northEast);
    // always initlize map this way , as it doesnt throw an error of map container already initialized
    this.map = L.map(this.mapElement.nativeElement, {
      center: this.mapView,
      zoom: this.initialZoom,
    });
    // Add OSM base map , getting map data from mapbox api 
    L.tileLayer('https://api.mapbox.com/styles/v1/mehroz/cls1ceyi500wu01pl4ezbdqab/tiles/{z}/{x}/{y}@2x?access_token=' + this.mapboxAccessToken, {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 20,
      minZoom: this.initialZoom,
      tileSize: 512,
      zoomOffset: -1,
      worldCopyJump: true,
    }).addTo(this.map);
    // Bounding map to world: fix of marker issues
    this.map.setMaxBounds(bounds);
    this.map.on('drag', function () {
      this.map?.panInsideBounds(bounds, { animate: false });
    });

    // adding legend
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map) {
      var div = L.DomUtil.create("div", "legend");
      div.innerHTML += "<h4>Overall Climate Risk Score</h4>";
      div.innerHTML += '<small class="max_values" >100<small>';
      div.innerHTML += '<span class="max_values" >Highest Risk<span>';
      div.innerHTML += '<div class="overall_risk_legend"></div>';
      div.innerHTML += '<small class="min_values" >0<small>';
      div.innerHTML += '<span class="min_values" >Lowest Risk<span>';
      return div;
    };
    legend.addTo(this.map);

    // binding click event on map
    this.map.on('click', (e) => {
      const classNames = e.originalEvent.target.className;
      var _type = typeof (classNames)
      if (_type == 'string') {
        var tooltipClicked = classNames.includes('leaflet-tooltip') || classNames.includes('location-name')
        var tooltipBtnClicked = classNames.includes('marker-tooltip-btn') || classNames.includes('added-svg')
        var loaderBtnClicked = classNames.includes('loader') || classNames.includes('loader-btn')
        var mapLegendClick = ['legend leaflet-control', 'max_values', 'min_values', 'overall_risk_legend', ''].includes(classNames)
      } else {
        tooltipClicked = false;
        tooltipBtnClicked = false;
        loaderBtnClicked = false;
      }

      if (tooltipClicked || loaderBtnClicked || mapLegendClick) return;
      if (tooltipBtnClicked) this.onTooltipButtonClick(e.originalEvent.target.id)
      if (!tooltipClicked && !tooltipBtnClicked && !loaderBtnClicked) {
        this.map.getZoom() <= 5 ? this.map.setView(e.latlng, this.map.getZoom() + 1) : this.onMapClick(e)
      }
    })
  }

  async loadTrialUserLocations() {
    try {
      // setTimeout(() => this.noCreditsLeftModalComponent.openModal())
      this.trialUserData = await this._locationAnalyticService.getTrialUserSavedLocations()
      this.locationSearchComponent.allowedLocationsLimit = this.trialUserData.total_credits
      this.locationSearchComponent.trialUserData = this.trialUserData
      if (this.trialUserData.places.length) {
        this.trialUserData.places = this.trialUserData.places.map((m) => {
          const latlng = [m.latitude, m.longitude]
          const data = this.locationSearchComponent.transformLocationObject(m)
          const identifier = this.locationSearchComponent.getIdentifier(latlng)
          return { ...data, added: false, checked: true, latlng, identifier }
        })
        const selectedLocation = this.trialUserData.places[0]
        await this.locationSearchComponent.addLocation(selectedLocation)
      }
    } catch (e) { }
  }

  async onMapClick(e, zoom_level = 0) {
    if (this.locationSearchComponent.analysisInProgress) return;
    if (this.locationSearchComponent.selectedLocations.length == this.locationSearchComponent.allowedLocationsLimit) { return this._taostr.error(this.locationSearchComponent.limitMsg) }
    var wrappedLatLng = this.map.wrapLatLng(e.latlng);
    const latitude = parseFloat(wrappedLatLng.lat)
    const longitude = parseFloat(wrappedLatLng.lng)
    this.unAddedLocation = { latlng: [latitude, longitude], identifier: this.locationSearchComponent.getIdentifier([latitude, longitude]), mapClicked: true, name: undefined }
    try {
      this.addMarkers()
      let zoom = zoom_level > 0 ? zoom_level : this.map.getZoom();
      let response: LALocation = await this._locationAnalyticService.getLocationDetails(latitude, longitude, zoom)
      if (Object.keys(response).length) {
        response.latlng = [wrappedLatLng.lat, wrappedLatLng.lng]
        this.unAddedLocation = this.locationSearchComponent.transformLocationObject(response)
        const alreadyAddedLocation = this.unAddedLocation.bbox.length ? this.locationSearchComponent.selectedLocations.find(_ => _?.bbox?.join(',') == this.unAddedLocation.bbox.join(','))
          : this.locationSearchComponent.selectedLocations.find(_ => _.identifier == this.unAddedLocation.identifier)
        if (alreadyAddedLocation) {
          this.unAddedLocation = undefined
          this._taostr.error(`${alreadyAddedLocation.name} is already added`)
        }
        this.addMarkers()
      } else {
        this.unAddedLocation = undefined
        this.addMarkers()
        this._taostr.error("Please select a correct place")
      }
    } catch (e) {
      console.log("ee", e)
      this.unAddedLocation = undefined
      this.addMarkers()
      this._taostr.error("Something went wrong.Please try again")
    }
  }

  async onTooltipButtonClick(identifier) {
    const index = this.locationSearchComponent.selectedLocations.findIndex(_ => _.identifier == identifier)
    if (index > -1) {
      // Added btn clicked
      const location = this.locationSearchComponent.selectedLocations[index]
      this.locationSearchComponent.selectedLocations.splice(index, 1)
      this.unAddedLocation = structuredClone(this.locationSearchComponent.transformLocationObject(location))
      this.removeLocationResult(location)
      this.addMarkers()
    } else {
      // Add btn clicked
      if (this.locationSearchComponent.selectedLocations.length == this.locationSearchComponent.allowedLocationsLimit) return this._taostr.error(this.locationSearchComponent.limitMsg)
      this.unAddedLocation.showSpinner = true, this.unAddedLocation.checked = true
      this.addMarkers()
      await this.locationSearchComponent.addLocation(this.unAddedLocation)
      this.unAddedLocation = undefined
      this.addMarkers()
      return;
    }
  }

  addMarkers(): void {
    const markerClick = (e) => { }

    // marker icon 
    const getMarker = (added) => {
      const markerSvg = `<svg width="22" height="28" viewBox="0 0 22 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 0.875C8.26596 0.878225 5.6448 1.96575 3.71153 3.89902C1.77826 5.83229 0.690736 8.45344 0.687511 11.1875C0.684236 
      13.4218 1.41406 15.5954 2.76501 17.375C2.76501 17.375 3.04626 17.7453 3.0922 17.7987L11 27.125L18.9116 17.7941C18.9528 17.7444
      19.235 17.375 19.235 17.375L19.2359 17.3722C20.5862 15.5934 21.3157 13.4207 21.3125 11.1875C21.3093 8.45344 20.2218 5.83229
      18.2885 3.89902C16.3552 1.96575 13.7341 0.878225 11 0.875ZM11 14.9375C10.2583 14.9375 9.53331 14.7176 8.91662 14.3055C8.29994
      13.8935 7.81929 13.3078 7.53546 12.6226C7.25163 11.9373 7.17737 11.1833 7.32207 10.4559C7.46676 9.72848 7.82391 9.0603 8.34836
      8.53585C8.87281 8.0114 9.54099 7.65425 10.2684 7.50955C10.9959 7.36486 11.7498 7.43912 12.4351 7.72295C13.1203 8.00678 13.706
      8.48743 14.118 9.10411C14.5301 9.7208 14.75 10.4458 14.75 11.1875C14.7488 12.1817 14.3533 13.1348 13.6503 13.8378C12.9473 14.5408 
      11.9942 14.9363 11 14.9375Z" fill="${added ? 'rgba(74, 113, 130, 1)' : '#009999'}"/>
      </svg>`
      return new L.divIcon({
        className: "marker",
        html: markerSvg,
        iconAnchor: [12, 24],
      });
    }

    // marker tooltip 
    const markerTooltipContent = (item) => {
      if (item.added) {
        return this.isTrialUser ? item.name : `<div class="location-name d-flex align-items-center">${item.name}
        <span class="green-button marker-tooltip-btn bg-dark-green" id="${item.identifier}">
        <img class='added-svg' id="${item.identifier}" src="assets/img/svg/location-analytic/tick.svg">
        </span>
        </div>`
      } else if (item.showSpinner) {
        return `<div class="location-name d-flex align-items-center">${item.name} 
        <span class="btn green-button loader-btn ml-2"> <div class="loader"></div> </span>
        </div>`
      } else {
        return `<div class="location-name d-flex align-items-center">${item.name} 
         <span class="green-button marker-tooltip-btn" id="${item.identifier}">Add</span>
         </div>`
      }
    }

    // removing map layers after a any location data changed 
    this.markersLayer?.remove();
    this.polygonLayer?.remove()

    // adding map layers for newly updated locations
    this.markersLayer = L.layerGroup().addTo(this.map);
    this.polygonLayer = L.geoJSON(null, {
      style: {
        "color": "#009999",
        "weight": 2,
        "fillColor": "transparent",
        "fillOpacity": 0.1
      }
    }).addTo(this.map);

    var locations = [];
    locations = this.unAddedLocation ? [...this.locationSearchComponent.selectedLocations, this.unAddedLocation] : this.locationSearchComponent.selectedLocations

    locations.forEach((item) => {
      if (item['mapClicked']) {
        // loader sign on map when clicked on map
        var LeafIcon = L.Icon.extend({ options: { iconAnchor: [26, 26] } });
        new L.marker(item.latlng, { icon: new LeafIcon({ iconUrl: 'assets/img/svg/green-loader.svg' }) }).addTo(this.markersLayer)
      } else {
        // adding a polygon 
        if (item.hasOwnProperty('shapefile') && item.shapefile.length) {
          let polygon = JSON.parse(item['shapefile'])
          const newFeature = {
            "type": "Feature",
            "geometry": polygon,
            "properties": {
              "identifier": item?.identifier,
              "added": item?.added
            }
          };
          this.polygonLayer.addData(newFeature)
          this.polygonLayer.eachLayer((layer) => {
            if (layer.feature.properties['identifier'] === item['identifier']) {
              layer.bindTooltip(markerTooltipContent(item), {
                permanent: true,
                interactive: true,
                autoPan: true,
              }).on({ click: markerClick });
            }
          })
        } else {
          // adding marker on map 
          new L.marker(item.latlng, { icon: getMarker(item.added) })
            .bindTooltip(markerTooltipContent(item), {
              permanent: true,
              interactive: true,
              autoPan: true,
              offset: [12, -12]
            })
            .addTo(this.markersLayer).on({ click: markerClick });
        }
      }
    })
  }

  async setLocationAnalysis(event) {
    const selectedLocation = event.selectedLocation;
    const scenario = event.scenario
    const response = event.response
    this.addMarkers()
    this.tableComponent.updateDataDictoneryWithScore({ response, selectedLocation, scenario })
    this.tableComponent.loadTable(this.globalOverviewComponent.scenariosCompoent.selectedScenario.value)
    this.globalOverviewComponent.loadOverview(response)
    this.selectedLocationsBarComponent.selectedLatlng = selectedLocation.identifier
    if (this.isTrialUser) {
      const index = this.trialUserData.places.findIndex(_ => _.identifier == selectedLocation.identifier)
      index == -1 ? this.trialUserData.places.push({ ...event.savedTrialLocation, added: true }) : this.trialUserData.places[index].added = true
      if (event.creditsUsed) this.trialUserData.credits_left = event.creditsUsed
    }
    this.setPdfFilters()
    this.globalOverviewComponent.scenariosCompoent.toggleSpinnerForScenarios(this.getLoadedScenariosList(selectedLocation))
    this.getOtherScenariosDataAsynchronously(selectedLocation, scenario)
  }


  async getOtherScenariosDataAsynchronously(selectedLocation, ignoreScenario) {
    const otherScenarios = IndexConstants.Scenarios.filter(_ => _.value != ignoreScenario)
    for (let i = 0; i < otherScenarios.length; i++) {
      const scenario = otherScenarios[i].value
      const payLoad = this.locationSearchComponent.getAPIpayload(selectedLocation, scenario)
      let response: any = await this._locationAnalyticService.getLocationAnalysisData(payLoad)
      const benchMark = await this._climatePriceService.getRiskBenchMark(IndexConstants.getBenchMarkParams({ h306: response.h3_06, scenario }))
      response = { ...response, benchMark: benchMark }
      this.tableComponent.updateDataDictoneryWithScore({ response, selectedLocation, scenario })
      this.globalOverviewComponent.scenariosCompoent.toggleSpinnerForScenarios(this.getLoadedScenariosList(selectedLocation))
    }
  }

  onCross(location) {
    const index = this.locationSearchComponent.selectedLocations.findIndex(_ => _.identifier == location.identifier)
    this.locationSearchComponent.selectedLocations.splice(index, 1)
    this.removeLocationResult(location)
    this.addMarkers()
  }

  removeLocationResult(location: LALocation): void {
    if (this.locationSearchComponent.selectedLocations.length == 0) {
      this.tableComponent.removeTable()
      this.globalOverviewComponent.removeScore()
    } else {
      this.tableComponent.removeLocation(location)
      if (this.selectedLocationsBarComponent.selectedLatlng == location.identifier) {
        this.updateSelectedLocationData(this.locationSearchComponent.selectedLocations[0])
      }
    }
    this.setPdfFilters()
  }

  updateSelectedLocationData(location: LALocation): void {
    const scenario = this.globalOverviewComponent.scenariosCompoent.selectedScenario.value
    this.selectedLocationsBarComponent.selectedLatlng = location.identifier
    let data = this.tableComponent.selectedlocationsData[location.identifier][scenario]
    this.globalOverviewComponent.loadOverview(data)
    this.setPdfFilters()
  }

  onScenarioSelection(scenario) {
    this.locationSearchComponent.selectedScenario = scenario
    const location = this.locationSearchComponent.selectedLocations.find(_ => _.identifier == this.selectedLocationsBarComponent.selectedLatlng)
    this.tableComponent.loadTable(scenario)
    this.updateSelectedLocationData(location)
  }

  toggleSpinnerForScenarios = (selectedLocation) => this.globalOverviewComponent.scenariosCompoent.toggleSpinnerForScenarios(this.getLoadedScenariosList(selectedLocation))

  onTableComponentToggle(event, toggleType) {
    switch (toggleType) {
      case 'score':
        this.globalOverviewComponent.locationImpactComponent.selectedScoreType = event
        break;
      case 'timePeriod':
        this.globalOverviewComponent.locationImpactComponent.selectedToggleItem = event
        break;
    }
  }

  onRIScoreToggle(event, toggleType): void {
    if (!this.tableComponent) return;
    switch (toggleType) {
      case 'score':
        this.tableComponent.selectedScoreType = event
        break;
      case 'timePeriod':
        this.tableComponent.selectedTimePeriod = event
        break;
    }
    this.tableComponent.loadTable()
  }

  onError(): void {
    this.unAddedLocation = undefined
    this.addMarkers()
    this._taostr.error("Data collection in progress. Please select another location for now")
  }

  setPdfFilters() {
    const selectedLocation = this.locationSearchComponent.selectedLocations.find(_ => _.identifier == this.selectedLocationsBarComponent.selectedLatlng)
    if (selectedLocation) {
      const sceanrio = this.globalOverviewComponent.scenariosCompoent.selectedScenario.value
      let params: any = selectedLocation?.bbox?.length ? { locations: JSON.stringify(selectedLocation.bbox), bbox: true } : { locations: JSON.stringify([selectedLocation.latlng]) }
      params = {
        ...params,
        name: selectedLocation.name,
        country: selectedLocation.country,
        scenario: sceanrio,
        latlng: JSON.stringify(selectedLocation.latlng),
        zoomLevel: this.map.getZoom(),
        state: selectedLocation.state
      }
      if (selectedLocation.shapefile) {
        const shapefile = JSON.parse(selectedLocation.shapefile)
        params = {
          ...params,
          shapefileType: shapefile.type,
          shapefileCoordinate: JSON.stringify(shapefile.coordinates)
        }
      }
      let url = 'location-impact-pdf'
      for (let key in params) {
        url = `${url}${url.includes("?") ? '&' : '?'}${key}=${params[key]}`
      }
      const filters = { pathname: url, data: {}, reportName: 'Location Explorer' }
      this._climatealphaService.pdfReportFilters$.next(filters)
    } else {
      this._climatealphaService.pdfReportFilters$.next(undefined)
    }
  }

  getLoadedScenariosList(selectedLocation) {
    return Object.keys(this.tableComponent.selectedlocationsData[selectedLocation.identifier])
  }

  ngAfterViewInit(): void { this._cdr.detectChanges() }

  ngOnDestroy(): void { this._climatealphaService.pdfReportFilters$.next(undefined) }

}
