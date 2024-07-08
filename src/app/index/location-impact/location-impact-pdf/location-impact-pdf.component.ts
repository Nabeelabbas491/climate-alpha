import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClimatePrice } from 'app/climate-price/climate-price.utils';
import { IndexConstants } from 'app/index/index-constants';
import { ImpactType, PDFReport, ScoreType } from 'app/index/index-interface';
import { AppConstants } from 'app/shared/data/constants';
import * as L from "leaflet";
@Component({
  selector: 'app-location-impact-pdf',
  templateUrl: './location-impact-pdf.component.html',
  styleUrls: ['./location-impact-pdf.component.scss', '../location-impact.component.scss']
})
export class LocationImpactPdfComponent implements OnInit {

  @ViewChild('leafletMap', { static: true }) mapElement: ElementRef;
  initialZoom: number = 17
  mapView: Array<number> = ClimatePrice.GlobalMapView
  mapboxAccessToken: string = AppConstants.MAPBOX_ACCESS_TOKEN;
  map: any;
  markersLayer: any;
  scorekeys = IndexConstants.Score_Keys;
  selectedScoreType: ScoreType = IndexConstants.Score_Keys.Score.key;
  indexToAlphabet = AppConstants.INDEX_TO_ALPHABET
  selectedScenario: string;
  reports = Object.assign({});
  date: Date = new Date()
  dataVersion: string;
  polygonLayer;
  propertyName: string;
  address: string;

  reportTypes = ['risk', 'resilience']
  listIndicators: string[] = []

  pdfContent = IndexConstants.PDF_Content
  colors = IndexConstants.riskColors
  riskFeatures = IndexConstants.riskTimePeriods

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    const resolvedData = this.route.snapshot.data.resolvedData

    console.log("resolved data", resolvedData)
    this.selectedScenario = resolvedData.scenario
    this.initialZoom = resolvedData.mapInitialZoom
    this.address = resolvedData.address
    this.propertyName = resolvedData.propertyName
    this.loadMap(resolvedData.mapLayer)
    resolvedData.shapefile ? this.addPolyGon(resolvedData) : this.addMarkerOnMap(resolvedData.latLng)
    this.dataVersion = resolvedData.dataVersion

    this.reportTypes.forEach((type, index) => { this.reports[type] = { ...this.getReportDict(resolvedData, type), overviewPageNumber: index + 2 } })

    const list = resolvedData.risk.Indicators.map((m) => m.headline.Title)
    this.listIndicators = list.map((title, i) => {
      return {
        title: title,
        pageNumber: [(i + 3) + (i + 1), (i + 3) + (i + 2)],
        risk: this.reports.risk.response.Indicators.find(_ => _.headline.Title == title),
        resilience: this.reports.resilience.response.Indicators.find(_ => _.headline.Title == title)
      }
    })
  }

  loadMap(layer) {
    this.map = L.map(this.mapElement.nativeElement, {
      center: this.mapView,
      zoom: this.initialZoom,
    });;
    // Add OSM base map , getting map data from mapbox api 
    L.tileLayer(layer + this.mapboxAccessToken, {
      id: 'mapbox/light-v9',
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      minZoom: this.initialZoom,
      tileSize: 512,
      zoomOffset: -1,
    }).addTo(this.map);
    // adding layer for marker
    this.markersLayer = L.layerGroup().addTo(this.map);

  }

  addMarkerOnMap(LatLng) {
    const getMarker = () => {
      return new L.divIcon({
        className: "marker",
        html: `<img src='assets/img/svg/green-marker.svg'>`,
        iconAnchor: [12, 24],
      });
    }
    new L.marker(LatLng, { icon: getMarker() }).addTo(this.markersLayer);
    this.map.setView(LatLng, this.initialZoom);
  }

  addPolyGon(data) {
    this.polygonLayer?.remove()
    this.polygonLayer = L.geoJSON(null, {
      style: {
        "color": "#009999",
        "weight": 2,
        "fillColor": "transparent",
        "fillOpacity": 0.1
      }
    }).addTo(this.map);

    if (data.hasOwnProperty('shapefile')) {
      var polygon = data['shapefile']
      console.log("polygon...", polygon)
      const newFeature = {
        "type": "Feature",
        "geometry": polygon,
      };
      this.polygonLayer.addData(newFeature)

      const bounds = this.polygonLayer.getBounds()
      this.map.flyToBounds(bounds);
    }

  }

  getReportDict(data, type): PDFReport {
    const getHighestValueKeyName = (item) => {
      let maxValue = -Infinity
      let highestValueKey = ''
      for (let key in item[this.selectedScoreType]) {
        if (item[this.selectedScoreType][key] > maxValue) {
          maxValue = item[this.selectedScoreType][key]
          highestValueKey = key
        }
      }
      return highestValueKey
    }

    return {
      type: type,
      response: { ...data[type], Indicators: data[type].Indicators.map((m) => { return { ...m, headline: { ...m.headline, 'Overall Cat': getHighestValueKeyName(m.headline) } } }) },
      nationalBenchMark: data.benchmark[type].find(_ => _.Title == 'Country Benchmark')
    }
  }

  returnZero() { return 0 }
}
