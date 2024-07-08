import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Asset } from 'app/climate-price/climate-price.interface';
import { ClimatePrice } from 'app/climate-price/climate-price.utils';
import { AppConstants } from 'app/shared/data/constants';
import { AppPermission } from 'app/shared/data/roles';
import { ClimatePriceService } from 'app/shared/services/climate-price.service';
import * as L from "leaflet";
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-singlpe-property-map',
  templateUrl: './singlpe-property-map.component.html',
  styleUrls: ['./singlpe-property-map.component.scss']
})
export class SinglpePropertyMapComponent implements OnInit {

  @ViewChild('leafletMap', { static: true }) mapElement: ElementRef;
  @Output() PropertyId = new EventEmitter<string | number>();
  @Output() AddToComparison = new EventEmitter();
  @Output() DataProcessingMsg = new EventEmitter();
  mapId: string = 'single-property-map';
  initialZoom: number = 2
  mapView: Array<number> = ClimatePrice.GlobalMapView
  mapboxAccessToken: string = AppConstants.MAPBOX_ACCESS_TOKEN;
  map: any;
  accordianOpen: boolean = true
  markersLayer: any;
  selectedProperty: Asset
  slug: string = ''
  properties: Array<Asset> = [];
  isSingleAsset: boolean = window.location.pathname.includes('single-asset');
  apiCallInProgress: boolean = false
  permissions = AppPermission.get().PorftolioAnalytics_DataManager

  constructor(private _climatePriceService: ClimatePriceService,
    private _toastr: ToastrService,
    private route: ActivatedRoute,) {
    this.slug = this.route.snapshot.paramMap.get("propertyId")
  }

  async ngOnInit(): Promise<void> {
    this.loadMap()
    if (this.isSingleAsset) {
      await this.getProperties()
      /** add markers on map  */
      this.addMarkers()
      this.setSelectedProperty()
      this.PropertyId.next(this.slug)
      this.initializeAccordian()
    }
  }

  initializeAccordian() {
    const panel = document.getElementById("panel-climate-price");
    panel.style.maxHeight = panel.scrollHeight + "px";
    const arrow = document.getElementById("accordian-arrow-climate-price")
    arrow.style.transition = 'unset'
  }

  async getProperties() {
    try {
      this.properties = await this._climatePriceService.singleAssetMap({ id: this.slug })
    } catch (e) {
      if (e.status == 'failed') this.DataProcessingMsg.next()
    }
  }

  toggle() {
    this.accordianOpen = !this.accordianOpen
    this._climatePriceService.toggleAccordian('panel-climate-price', 'accordian-arrow-climate-price')
  }

  loadMap() {
    /** loading map  mapbox://styles/v1/mehroz/clilc0kcv00h601r13duj1k06*/
    // always initlize map this way , as it doesnt throw an error of map container already initialized
    // World map bounds
    var southWest = L.latLng(-89.98155760646617, -180),
      northEast = L.latLng(89.99346179538875, 180);
    var bounds = L.latLngBounds(southWest, northEast);
    this.map = L.map(this.mapElement.nativeElement, {
      center: this.mapView,
      zoom: this.initialZoom,
    });;
    // Add OSM base map , getting map data from mapbox api 
    L.tileLayer('https://api.mapbox.com/styles/v1/mehroz/clilc0kcv00h601r13duj1k06/tiles/{z}/{x}/{y}?access_token=' + this.mapboxAccessToken, {
      id: 'mapbox/light-v9',
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 15,
      minZoom: this.initialZoom,
      tileSize: 512,
      zoomOffset: -1,
    }).addTo(this.map);

    // Bounding map to world: fix of marker issues
    this.map.setMaxBounds(bounds);
    this.map.on('drag', function () {
      this.map?.panInsideBounds(bounds, { animate: false });
    });
    // adding layer for marker
    this.markersLayer = L.layerGroup().addTo(this.map);
  }


  getIcon(item) {
    const circleSvg = `
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"> 
    <circle cx="6" cy="6" r="5.5" fill="${item.color}" fill-opacity="0.4" stroke="${item.color}"/>
    </svg>
    `;

    const markerSvg = `
    <svg width="22" height="28" viewBox="0 0 22 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 0.875C8.26596 0.878225 5.6448 1.96575 3.71153 3.89902C1.77826 5.83229 0.690736 8.45344 0.687511 11.1875C0.684236 
    13.4218 1.41406 15.5954 2.76501 17.375C2.76501 17.375 3.04626 17.7453 3.0922 17.7987L11 27.125L18.9116 17.7941C18.9528 17.7444
    19.235 17.375 19.235 17.375L19.2359 17.3722C20.5862 15.5934 21.3157 13.4207 21.3125 11.1875C21.3093 8.45344 20.2218 5.83229
    18.2885 3.89902C16.3552 1.96575 13.7341 0.878225 11 0.875ZM11 14.9375C10.2583 14.9375 9.53331 14.7176 8.91662 14.3055C8.29994
    13.8935 7.81929 13.3078 7.53546 12.6226C7.25163 11.9373 7.17737 11.1833 7.32207 10.4559C7.46676 9.72848 7.82391 9.0603 8.34836
    8.53585C8.87281 8.0114 9.54099 7.65425 10.2684 7.50955C10.9959 7.36486 11.7498 7.43912 12.4351 7.72295C13.1203 8.00678 13.706
    8.48743 14.118 9.10411C14.5301 9.7208 14.75 10.4458 14.75 11.1875C14.7488 12.1817 14.3533 13.1348 13.6503 13.8378C12.9473 14.5408 
    11.9942 14.9363 11 14.9375Z" fill="${item.color}"/>
    </svg>
    `

    const icon = L.divIcon({
      className: "marker",
      html: this.slug == item.property_id ? markerSvg : circleSvg,
      // iconSize: [40, 40],
      iconAnchor: this.slug == item.property_id && [12, 24],   // moving marker tip to exactly at circle clicked
      // popupAnchor: [7, -16],
      ...item
    });

    return icon
  }

  getIconColor = (value) => {
    switch (true) {
      // More than 0 = green
      case (value >= 0 && value <= 35):
        return '#009999';
      // Between 0 and -8 = yellow
      case (value >= 36 && value <= 64):
        return '#EAAE14';
      // Less than -8 = red
      case (value >= 65 && value <= 100):
        return '#810000';
    }
  }

  async addMarkers() {

    const markerClick = (e) => {
      if (this.apiCallInProgress && this.selectedProperty) return this._toastr.error('Please wait. Current location data is in progress.')
      this.slug = e.sourceTarget.options.icon.options.property_id
      this.updateMapIconLayer()
      this.PropertyId.next(this.slug)
    }
    this.properties.forEach((item) => {
      if (item.longitude && item.latitude) {
        const tooltip = `${item.title ? item.title + "," : ''} ${item.address}, ${item.city}, ${item.state ? item.state + "," : ''} ${item.zip_code ? item.zip_code + "," : ''} ${item.country}`
        item.location = tooltip
        item.color = this.getIconColor(item.overall_score)
        new L.marker([item.latitude, item.longitude], { icon: this.getIcon(item) })
          .bindTooltip(tooltip, { offset: item.property_id == this.slug ? [8, -12] : [4, 4], autoPan: true })
          .addTo(this.markersLayer).on({ click: this.isSingleAsset && markerClick });
      }
    })
    // this.map.flyTo([this.selectedProperty.latitude, this.selectedProperty.longitude])
  }

  updateMapIconLayer() {
    this.setSelectedProperty()
    this.markersLayer.remove()
    this.markersLayer = L.layerGroup().addTo(this.map);
    this.addMarkers()
  }

  onDropdownChange() {
    this.updateMapIconLayer()
    this.PropertyId.next(this.slug)
  }

  setSelectedProperty = () => this.selectedProperty = this.properties.find(m => m.property_id == this.slug)

  setComparisonConfigurations(comparison) {
    this.initializeAccordian()
    this.properties = comparison.mapData
    this.slug = comparison.assetId
    this.updateMapIconLayer()
  }


}
