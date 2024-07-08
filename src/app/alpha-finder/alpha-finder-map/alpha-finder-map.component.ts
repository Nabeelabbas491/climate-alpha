import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppConstants } from 'app/shared/data/constants';
import { AlphaFinderService } from 'app/shared/services/alpha-finder.service';
import * as L from "leaflet";
import { AlphaFinderConstants } from '../alpha-finder.constants';

@Component({
  selector: 'app-alpha-finder-map',
  templateUrl: './alpha-finder-map.component.html',
  styleUrls: ['./alpha-finder-map.component.scss']
})
export class AlphaFinderMapComponent implements OnInit, AfterViewInit {

  @Output() changeAssetClass = new EventEmitter();
  @Output() dropDownValueEvent = new EventEmitter();
  @Output() ModalEvent = new EventEmitter()
  @Input() map_id = 'alphaFinderMap'
  @Input() mapView = []
  @Input() totalRanking;

  mapboxAccessToken = AppConstants.MAPBOX_ACCESS_TOKEN;
  markersLayer: any;
  markers: any;
  map: any;
  legend: any;
  dropDownValue = '';
  info

  constructor(public alphaService: AlphaFinderService) { }

  ngOnInit() { }

  ngAfterViewInit(): void {
    this.createMarkers();
    this.loadMap()
  }

  createMarkers() {
    var self = this;
    var LeafIcon = L.Icon.extend({
      options: {
        iconSize: [16, 22],
        iconAnchor: [8, 22],
      }
    });

    var firstMarker = new LeafIcon({
      iconUrl: AppConstants.AF_FIRST,
      shadowUrl: ''
    });
    var secondMarker = new LeafIcon({
      iconUrl: AppConstants.AF_SECOND,
      shadowUrl: ''
    });
    var thirdMarker = new LeafIcon({
      iconUrl: AppConstants.AF_THIRD,
      shadowUrl: ''
    });
    var fourthMarker = new LeafIcon({
      iconUrl: AppConstants.AF_FOURTH,
      shadowUrl: ''
    });
    var fifthMarker = new LeafIcon({
      iconUrl: AppConstants.AF_FIFTH,
      shadowUrl: ''
    });

    this.markers = this.getMarkers(firstMarker, secondMarker, thirdMarker, fourthMarker, fifthMarker)
  }

  removeMarkers() {
    this.markersLayer.clearLayers();
  }

  addMarkers(locations) {

    var self = this;

    function highlightFeature(e) {
      self.info.update(e.target.getTooltip()._content);
    }

    function resetHighlight(e) {
      self.info.update();
    }

    // function getColor(i) {
    //   let colors = self.totalRanking === 20 ? AlphaFinderConstants.topTwentyRankingColors : AlphaFinderConstants.topTenRankingColors
    //   return colors[i]
    // }

    function getMarker(i) {
      return self.markers[i]
    }

    const openTopCountyListModal = (e) => {
      // this.ModalEvent.next(e.sourceTarget.options.county_data)
    }
    // adding marekrs 
    var opacity = 1;
    for (var i = 0; i < locations.length; i++) {
      let rank = i + 1;
      let marker = new L.marker(
        [locations[i]['latitude'], locations[i]['longitude']],
        {
          icon: getMarker(rank),
          opacity: opacity,
          county_data: locations[i],
        }
      )

        // .bindTooltip(self.tooltip(locations[i], getColor(rank), rank), { offset: [0, 0], opacity: 0 })
        .bindTooltip(locations[i].mapToolTip, { offset: [0, 0], opacity: 0 })  // passing true as second arg will show exact tooltip on marker too
        .addTo(this.markersLayer);
      marker.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: openTopCountyListModal
      });
    }
  }

  // tooltip(location, color, rank) {
  //   if (location.dropDownSelection.rankingType === 'counties') {
  //     // County ToolTip
  //     let headerHTMLString = `<b>${location['name']} </b> <br> <span style="color:${color}"> Rank ${rank}</span>
  //       <div style="border-top: 1px solid black;" class="mt-2 pt-1">
  //                   <span> Top Zip Codes in County </span><br> <br> `

  //     let zipCodesHTMLString = ''
  //     location.topZipCodes.forEach((item, index) => {
  //       zipCodesHTMLString = `${zipCodesHTMLString} <span> <span style="font-family:Montserrat ;font-style: normal; font-weight: 700;font-size: 14px;color: #006666;line-height: 22px;">
  //       ${index + 1}.</span>
  //       &nbsp; ${item}
  //      </span> <br>`
  //     })
  //     return `${headerHTMLString}${zipCodesHTMLString}`
  //   } else {
  //     // zip Code ToolTip
  //     let tooltipString = `<b>${location['zip_code']} </b> <br> <br> <span"> ${location['county_name']}</span> <br> <span style="color:${color}"> Rank ${rank}</span> `
  //     return `${tooltipString}`
  //   }
  // }

  loadMap() {
    this.map = L.map(this.map_id).setView(this.mapView, 4);
    // Add OSM base map , getting map data from mapbox api 
    L.tileLayer('https://api.mapbox.com/styles/v1/mehroz/ckr37au0g1s9f17mhtzeznh0e/tiles/{z}/{x}/{y}?access_token=' + this.mapboxAccessToken, {
      id: 'mapbox/light-v9',
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 15,
      minZoom: 4,
      tileSize: 512,
      zoomOffset: -1,
    }).addTo(this.map);
    this.markersLayer = L.layerGroup().addTo(this.map);

    this.info = L.control();

    this.info.onAdd = function (map) {
      this._div = L.DomUtil.create("div", "map_info_lv");
      this.update();
      return this._div;
    };

    this.info.update = function (tooltip) {
      this._div.innerHTML = tooltip ? tooltip : "";
    };

    this.info.addTo(this.map);

  }

  getMarkers(firstMarker, secondMarker, thirdMarker, fourthMarker, fifthMarker) {
    let topTwentyMarkers = {
      '1': firstMarker,
      '2': firstMarker,
      '3': firstMarker,
      '4': firstMarker,
      '5': secondMarker,
      '6': secondMarker,
      '7': secondMarker,
      '8': secondMarker,
      '9': thirdMarker,
      '10': thirdMarker,
      '11': thirdMarker,
      '12': thirdMarker,
      '13': fourthMarker,
      '14': fourthMarker,
      '15': fourthMarker,
      '16': fourthMarker,
      '17': fifthMarker,
      '18': fifthMarker,
      '19': fifthMarker,
      '20': fifthMarker,
    }

    let topTenMarkers = {
      '1': firstMarker,
      '2': firstMarker,
      '3': secondMarker,
      '4': secondMarker,
      '5': thirdMarker,
      '6': thirdMarker,
      '7': fourthMarker,
      '8': fourthMarker,
      '9': fifthMarker,
      '10': fifthMarker,
    }

    if (this.totalRanking === 20) {
      return topTwentyMarkers
    } else {
      return topTenMarkers
    }

  }

  rankingsData(data) {
    this.removeMarkers();
    this.addMarkers(data);
  }

  // onSelection(data) {
  //   this.totalRanking = data.value
  //   this.selectedType = data.name
  //   this.dropDownValueEvent.next(data);
  // }
}
