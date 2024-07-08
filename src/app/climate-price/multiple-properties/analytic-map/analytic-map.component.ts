import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AppConstants } from 'app/shared/data/constants';
import * as L from "leaflet";
import { ClimatePriceService } from 'app/shared/services/climate-price.service';
import 'leaflet.markercluster';
import { ClimatePrice } from 'app/climate-price/climate-price.utils';
import * as ss from 'simple-statistics'
import { IndexConstants } from 'app/index/index-constants';
import { AppPermission } from 'app/shared/data/roles';
@Component({
  selector: 'app-analytic-map',
  templateUrl: './analytic-map.component.html',
  styleUrls: ['./analytic-map.component.scss']
})
export class AnalyticMapComponent implements OnInit, OnDestroy {

  @ViewChild('leafletMap', { static: true }) private mapElement: ElementRef;
  @Output() ApiSubscribed = new EventEmitter();
  mapId: string = 'multiple-properties-map';
  map: any;
  legendValues: any = [];
  allMarkers: any = [];
  legend: any;
  marker: any;
  apiData: any;
  markersLayer: any;
  selectedScenario: string = IndexConstants.DefaultScenario;
  markerSVG = AppConstants.RETAIL;
  mapboxAccessToken: string = AppConstants.MAPBOX_ACCESS_TOKEN;
  initialZoom: number = 2
  mapView: Array<number> = ClimatePrice.GlobalMapView
  headerOptions: any = {
    'Physical Impact': { unit: '%', decimalPointValue: 2, colorObject: 'climatePriceColors', label: 'Physical Impact', backendKey: 'physical_impact' },
    'Heat Stress': { unit: '', decimalPointValue: 0, colorObject: 'RIColors', label: 'Heat Stress', backendKey: 'heat_score' },
    'Drought': { unit: '', decimalPointValue: 0, colorObject: 'RIColors', label: 'Drought', backendKey: 'drought_score' },
    'Hurricane Wind': { unit: '', decimalPointValue: 0, colorObject: 'RIColors', label: 'Hurricane Wind', backendKey: 'wind_score' },
    'Inland Flooding': { unit: '', decimalPointValue: 0, colorObject: 'RIColors', label: 'Inland Flooding', backendKey: 'inland_flood_score' },
    'Coastal Flooding': { unit: '', decimalPointValue: 0, colorObject: 'RIColors', label: 'Coastal Flooding', backendKey: 'coastal_flood_score' },
    'Wildfire': { unit: '', decimalPointValue: 0, colorObject: 'RIColors', label: 'Wildfire', backendKey: 'fire_score' },
  };
  headerCustomOrder = ['Physical Impact', 'Heat Stress', 'Drought', 'Hurricane Wind', 'Inland Flooding', 'Coastal Flooding', 'Wildfire'];
  selectedSection: string = 'Physical Impact'
  selectedDataKey: string = this.headerOptions[this.selectedSection].backendKey;
  selectedColorObject: string = this.headerOptions[this.selectedSection].colorObject;
  decimalPointValue: number = this.headerOptions[this.selectedSection].decimalPointValue;
  legendUnit: string = this.headerOptions[this.selectedSection].unit;
  RIColors = [
    { color: '#00939C', rgba: 'rgba(0,147,156,0.85)', label: '' },
    { color: '#5DBABF', rgba: 'rgba(93,186,191,0.85)', label: '' },
    { color: '#BAE1E2', rgba: 'rgba(186,225,226,0.85)', label: '' },
    { color: '#F8C0AA', rgba: 'rgba(248,192,170,0.85)', label: '' },
    { color: '#DD7755', rgba: 'rgba(221,119,85,0.85)', label: '' },
    { color: '#C22E00', rgba: 'rgba(194,46,0,0.85)', label: '' }
  ]
  climatePriceColors = [
    { color: '#C22E00', rgba: 'rgba(194,46,0,0.85)' },
    { color: '#DD7755', rgba: 'rgba(221,119,85,0.85)' },
    { color: '#F8C0AA', rgba: 'rgba(248,192,170,0.85)' },
    { color: '#BAE1E2', rgba: 'rgba(186,225,226,0.85)' },
    { color: '#5DBABF', rgba: 'rgba(93,186,191,0.85)' },
    { color: '#00939C', rgba: 'rgba(0,147,156,0.85)' }
  ]
  RILabels = [
    `<i style="background:#00939C"></i> Very Low Risk`,
    `<i style="background:#5DBABF"></i> Low Risk`,
    `<i style="background:#F8C0AA"></i> Medium Risk`,
    `<i style="background:#DD7755"></i> High Risk `,
    `<i style="background:#C22E00"></i>Very High Risk `,
  ]
  isApiSubscribed: boolean;
  permissions = AppPermission.get().PorftolioAnalytics_DataManager

  constructor(private _climatePriceService: ClimatePriceService) { }

  ngOnInit(): void {
    this.loadMap();
    if (window.location.pathname.includes('multiple-assets')) {
      if (window.location.search.includes(AppConstants.Public_Link_Key)) return;
      this.getData();
    }
  }

  async onMapTypeChange(type) {
    this.selectedSection = type;
    this.isApiSubscribed = false
    this.legendValues = [];
    this.selectedDataKey = this.headerOptions[this.selectedSection].backendKey;
    this.selectedColorObject = this.headerOptions[this.selectedSection].colorObject;
    this.decimalPointValue = this.headerOptions[this.selectedSection].decimalPointValue;
    this.legendUnit = this.headerOptions[this.selectedSection].unit;
    this.addMarkers(this.apiData);
    this.isApiSubscribed = true
    this.ApiSubscribed.next()
  }

  setServiceVariable() {
    // for comarison section , maintain user selection across all comparison
    if (window.location.pathname == '/portfolio-analytics/comparison') this._climatePriceService.multiAssetMapSelectedLabel = this.selectedSection
  }

  loadLegend() {
    let self = this;
    if (this.legend) this.legend.remove();
    this.legend = L.control({ position: "bottomright" });
    this.legend.onAdd = function (map) {
      var div = L.DomUtil.create("div", "map_info_lv map_legend_lv multi_asset_map_legend"),
        grades = self.legendValues,
        labels = [],
        from,
        to;
      div.innerHTML = `<div class='multi-asset-legend-title'>
      <div class="app-tooltip left">  ${self.selectedSection}
      <span class="tooltiptext" style="top:-55px; right:120%">
      While Physical Impact and Resilience-adjusted Impact are understood as a percentage-range, climate factors are depicted as having Very Low, Low, Medium, High or Very High Risk.
      </span>
      </div>
      </div>`
      if (self.legendUnit == '') {
        labels = self.RILabels;
      }
      else {
        for (var i = 0; i < grades.length; i++) {
          from = grades[i];
          to = grades[i + 1];

          from = Number(from.toFixed(self.decimalPointValue));
          to = Number(to).toFixed(self.decimalPointValue);
          if (from !== 100 || self.legendUnit !== '') {
            // To not add Risk value as last + block when they are 100
            labels.push(
              '<i style="background:' +
              self.colorSelect(from) +
              '"></i>' +
              from + self.legendUnit +
              (to && !isNaN(to) ? " to " + to + self.legendUnit : "+")
            );
          }
        }
      }

      div.innerHTML += labels.join(`<br>`);
      return div;
    };

    this.legend.addTo(this.map);
  }

  addMarkers(locations) {
    var self = this;
    this.markersLayer?.clearLayers();
    self.allMarkers = [];
    var opacity = 0.85;
    var color = this[this.selectedColorObject][5].rgba;

    // Create a single DivIcon to be reused for all markers
    var markerIcon = new L.DivIcon({
      html: `<div style=background-color:${color}> <span> <span aria-label="markers"></span></span></div>`,
      className: 'marker-cluster-single',
      iconSize: new L.Point(15, 15)
    });

    var markersToAdd = [];

    for (var i = 0; i < locations.length; i++) {
      let data_value = typeof locations[i][self.selectedDataKey] !== 'string' &&
        Number(locations[i][self.selectedDataKey]?.toFixed(self.decimalPointValue));

      markersToAdd.push(
        L.marker(
          [locations[i]['lat'], locations[i]['long']],
          { icon: markerIcon, opacity: opacity, data: data_value }
        ).bindTooltip(
          `${self.selectedSection}: ${data_value}${self.legendUnit}`, { className: 'multi_asset_tt' }
        )
      );
    }

    // Add all markers to the map in a single operation
    self.markersLayer?.addLayers(markersToAdd);

    // Firing the event to calculate quantile percentiles of average values of cluster.
    self.markersLayer?.fire('animationend');
  }

  loadMap() {
    var self = this;
    /** loading map  */
    // creates a map object and set view to U.S
    // always initlize map this way , as it doesnt throw an error of map container already initialized

    var southWest = L.latLng(-89.98155760646617, -180),
      northEast = L.latLng(89.99346179538875, 180);
    var bounds = L.latLngBounds(southWest, northEast);

    this.map = L.map(this.mapElement.nativeElement, {
      center: this.mapView,
      zoom: this.initialZoom,
      maxZoom: 17,
      minZoom: 2,
    });
    // Bounding map to world: fix of marker issues
    this.map.setMaxBounds(bounds);
    this.map.on('drag', function () {
      this.map.panInsideBounds(bounds, { animate: false });
    });
    // Add OSM base map , getting map data from mapbox api 
    L.tileLayer('https://api.mapbox.com/styles/v1/mehroz/clhkcs3si01mv01pg2ax061da/tiles/{z}/{x}/{y}?access_token=' + this.mapboxAccessToken, {
      id: 'v1',
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 17,
      minZoom: this.initialZoom,
      tileSize: 512,
      zoomOffset: -1,
    }).addTo(this.map);

    this.markersLayer = L.markerClusterGroup({
      spiderfyOnMaxZoom: false,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      iconCreateFunction: function (cluster) {
        let average;
        if (!cluster.options.avg) {
          let children = cluster.getAllChildMarkers();
          // Calculate the average sum of the 'field' property
          let sum = children.reduce((acc, obj) => acc + obj.options.data, 0);
          average = sum / children.length;
          average = Number(average.toFixed(self.decimalPointValue));
          cluster.options.avg = average;
        } else {
          average = cluster.options.avg;
        }
        let childCount = cluster.getChildCount();
        let color = self.colorSelect(average, 'rgba');
        var c = ' marker_cluster_', p = 40;
        if (childCount < 50) {
          c += 's';
        } else if (childCount < 500) {
          c += 'm';
          p = 60;
        } else {
          p = 80;
          c += 'l';
        }

        if (self.allMarkers.indexOf(average) < 0) self.allMarkers.push(average);
        return new L.DivIcon({
          html: `<div style=background-color:${color}> <span> <span aria-label="markers"></span></span></div>`,
          className: 'marker-cluster' + c,
          iconSize: new L.Point(p, p)
        });
      }
    }).addTo(this.map);

    this.markersLayer.on('clustermouseover', function (a) {
      let childCount = a.layer.getChildCount();
      let average = a.layer.options.avg
      a.layer.unbindPopup();
      a.layer.bindPopup(
        `Total assets: ${childCount} <br> Average ${self.selectedSection}: ${average}${self.legendUnit}`,
        { closeButton: false, className: 'multi_asset_popup' }
      );
      a.layer.openPopup()
    });

    this.markersLayer.on('clustermouseout', function (a) {
      a.layer.closePopup();
    });

    this.markersLayer.on('animationend', function () {
      if (self.allMarkers.length) {
        let values = self.allMarkers;
        self.legendValues = ss.quantile(values, [0, 0.2, 0.4, 0.6, 0.8, 1]);
        self.legendValues = self.legendValues.map(value => Number(value.toFixed(self.decimalPointValue)));
        self.legendValues = [...new Set(self.legendValues)]
        self.loadLegend();
        self.allMarkers = [];
        self.markersLayer.refreshClusters();
        self.markersLayer.eachLayer(function (layer) {
          if (layer instanceof L.Marker) {
            // Perform operations on each marker
            let data_value = layer.options.data;
            const largest_value = Math.max(...self.legendValues);
            if (data_value > largest_value) {
              // updating legendValues array with individual marker values if they are larger than the average of clusters
              self.legendValues.push(data_value);
            }
            let color = self.colorSelect(data_value, 'rgba');
            let marker = new L.DivIcon({
              html: `<div style=background-color:${color}> <span> <span aria-label="markers"></span></span></div>`,
              className: 'marker-cluster-single',
              iconSize: new L.Point(15, 15)
            });
            layer.setIcon(marker);
          }
        });
      }
    });
  }

  async getData() {
    try {
      this.isApiSubscribed = false
      this.apiData = await this._climatePriceService.getMapData(this.selectedScenario);
      this.apiData = this.apiData.map((m) => { return { ...m, physical_impact: parseFloat(m.physical_impact) } })
      this.onMapTypeChange(this.selectedSection)
    } catch (e) {
      this.isApiSubscribed = true;
    }
  }

  // onScenarioChange({ scenario }) {
  //   this.selectedScenario = scenario;
  //   if (this.apiData) {
  //     let map_data = this.apiData.filter((m) => m.scenario == this.selectedScenario)
  //     this.markersLayer.clearLayers();
  //     this.addMarkers(map_data);
  //   }
  // }

  getRiskCategory(score) {
    // For RI maps only
    let clr;
    if (score >= 80) {
      clr = '#C22E00';
    } else if (score >= 60 && score < 80) {
      clr = '#DD7755';
    } else if (score >= 40 && score < 60) {
      clr = '#F8C0AA';
    } else if (score >= 20 && score < 40) {
      clr = '#5DBABF';
    } else {
      clr = '#00939C';
    }
    return clr;
  }

  colorSelect(x, attribute = 'color') {
    x = Number(x);
    if (this.legendUnit == '') {
      // for RI maps
      return this.getRiskCategory(x)
    } else {
      for (let i = 0; i < 6; i++) {
        if (x <= this.legendValues[i]) {
          let idx = attribute == 'rgba' ? i - 1 : i;
          idx = idx < 0 ? 0 : idx;
          return this[this.selectedColorObject][idx][attribute];
        }
      }
      return this[this.selectedColorObject][5].rgba;
    }
  }

  ngOnDestroy(): void { }

}
