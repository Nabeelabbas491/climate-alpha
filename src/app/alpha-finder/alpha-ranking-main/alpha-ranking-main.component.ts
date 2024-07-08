import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlphaFinderService } from 'app/shared/services/alpha-finder.service';
import { AlphaFinderMapComponent } from '../alpha-finder-map/alpha-finder-map.component';
import { SaveSelectedFeatureSearchComponent } from '../save-selected-feature-search/save-selected-feature-search.component';
import * as cloneDeep from "lodash/cloneDeep";
import { AppConstants } from 'app/shared/data/constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlphaRankingBarsComponent } from '../alpha-ranking-bars/alpha-ranking-bars.component';
import { AlphaFinderConstants } from '../alpha-finder.constants';
import { Country } from '../alpha-finder.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-alpha-ranking-main',
  templateUrl: './alpha-ranking-main.component.html',
  styleUrls: ['./alpha-ranking-main.component.scss']
})
export class AlphaRankingMainComponent implements OnInit {

  @ViewChild("selectedFeatures", { static: true }) selectedFeaturesInstance: SaveSelectedFeatureSearchComponent
  @ViewChild(AlphaFinderMapComponent) mapInstance: AlphaFinderMapComponent
  @ViewChild(AlphaRankingBarsComponent) rankingbarsInstance: AlphaRankingBarsComponent
  response: any = []
  errorMsg = false
  dropDownList = [
    { title: 'Show Top 10 Counties', value: 10, rankingType: 'counties', name: 'Counties' },
    { title: 'Show Top 20 Counties', value: 20, rankingType: 'counties', name: 'Counties' },
    { title: 'Show Top 10 Zip Codes', value: 10, rankingType: 'zip_codes', name: 'Zip Codes' },
    { title: 'Show Top 20 Zip Codes', value: 20, rankingType: 'zip_codes', name: 'Zip Codes' },
  ]
  selectedType = this.dropDownList[1].rankingType
  topCountiesNumber = 20
  reports_type = AppConstants.reports_type['Alpha-finder']
  export_filters;
  sub_heading: string = '';
  placeholder = 'Show Top 20 Counties'
  mapView = AppConstants.US_MAP_VIEW
  showExportButtonsFooter: boolean = true
  country: Country

  constructor(public alphaFinderService: AlphaFinderService, public route: ActivatedRoute, public router: Router, public toastr: ToastrService) {
    this.country = this.route.snapshot.data.country
  }

  ngOnInit(): void {
    this.getSelectedData()
  }

  getSelectedData() {
    let data = this.alphaFinderService.getItem()
    this.sub_heading = ` No. Features : ${data[0].selectedSubCatgeoriesCount} <br/>`;
    this.selectedFeaturesInstance['features'] = data.map((item) => {
      return {
        ...item,
        sub_categories: item.sub_categories.map((m) => { return { ...m, showResult: true } })
      }
    })
    this.getApiData(data)
  }

  async fetchApi(data) {
    this.response = await this.alphaFinderService.geTopTwentyFiveCounties(data)
  }

  async getApiData(features) {
    try {
      let uuids = []
      features.forEach((category) => {
        category.sub_categories.forEach((subCategory) => {
          uuids.push(subCategory.uuid)
        })
      })
      let data = Object.assign({ feature_uuids: uuids })
      await this.fetchApi(data)
      this.errorMsg = false
      setTimeout(() => {
        this.updateAlphaFinderSearch(this.dropDownList.find(m => m.value === this.topCountiesNumber))
      })
    } catch (e) {
      e.status === 400 ? this.errorMsg = true : '';
      if (e.status === 422) {
        this.router.navigate([`alpha-finder/dashboard/${this.country.path}`])
        return this.toastr.error(e.error.message);
      }
    }
  }

  updateAlphaFinderSearch(selectedDropdownItem) {
    this.selectedType = selectedDropdownItem.rankingType
    this.topCountiesNumber = selectedDropdownItem.value
    this.mapInstance.totalRanking = selectedDropdownItem.value

    let rankingsData = this.getDictioneryForMapAndRakingBars(selectedDropdownItem)
    rankingsData = this.setStaticBarsWidth(rankingsData, selectedDropdownItem)
    let apiData = cloneDeep(rankingsData.filter((item, index) => {
      return index < selectedDropdownItem.value
    }))
    this.rankingbarsInstance.barsListing = apiData
    this.rankingbarsInstance.selectedType = this.selectedType;
    this.rankingbarsInstance.title = `Top Performing Locations Ranking`
    this.rankingbarsInstance.modalTitle = `Select ${selectedDropdownItem.name} to export`
    this.mapInstance.createMarkers()
    this.mapInstance.rankingsData(apiData)
    this.setPdfFilters(selectedDropdownItem, apiData)
  }

  getDictioneryForMapAndRakingBars(selectedDropdownItem) {

    function getMapTooltip(location, color, rank) {
      if (location.dropDownSelection.rankingType === 'counties') {
        // County ToolTip
        let headerHTMLString = `<b>${location['name']} </b> <br> <span style="color:${color}"> Rank ${rank}</span>
          <div style="border-top: 1px solid black;" class="mt-2 pt-1">
                      <span> Top Zip Codes in County </span><br> <br> `

        let zipCodesHTMLString = ''
        location.topZipCodes.forEach((item, index) => {
          zipCodesHTMLString = `${zipCodesHTMLString} <span> <span style="font-style: normal; font-weight: 700;font-size: 14px;color: #006666;line-height: 22px;">
          ${index + 1}.</span>
          &nbsp; ${item}
         </span> <br>`
        })
        return `${headerHTMLString}${zipCodesHTMLString}`
      } else {
        // zip Code ToolTip
        let tooltipString = `<b>${location['zip_code']} </b> <br> <br> <span"> ${location['county_name']}</span> <br> <span style="color:${color}"> Rank ${rank}</span> `
        return `${tooltipString}`
      }
    }

    let rankingsData = []
    rankingsData = cloneDeep(this.response)
    rankingsData = rankingsData[selectedDropdownItem.rankingType].map((item, index) => {
      return {
        ...item,
        export: false,
        disabled: false,
        dropDownSelection: selectedDropdownItem,
        rankingType: selectedDropdownItem.rankingType,
        county_name: item.county + " County",
        topZipCodes: rankingsData['top_zip_in_counties'][item.county_code],
        state_initials: AppConstants.StatesInfo[item.state],
        color: this.getcolor(index + 1, selectedDropdownItem.value),
        county_code: item.county_code.length < 5 ? `0${item.county_code}` : item.county_code,
        name: selectedDropdownItem.rankingType === 'counties' ? item.county.includes('County') ? item.county : `${item.county} County, ${AppConstants.StatesInfo[item.state]}`
          : item.county.includes('County') ? `${item.zip_code}, ${item.county}, ${AppConstants.StatesInfo[item.state]}`
            : `${item.zip_code}, ${item.county} County, ${AppConstants.StatesInfo[item.state]}`,
        rank: index + 1
      }
    })

    rankingsData = rankingsData.map((item, idx) => {
      return { ...item, mapToolTip: getMapTooltip(item, item.color, item.rank) }
    })

    return rankingsData
  }

  getcolor(i, totalBars) {
    let colors = totalBars === 20 ? AlphaFinderConstants.topTwentyRankingColors : AlphaFinderConstants.topTenRankingColors
    return colors[i]
  }

  setStaticBarsWidth(rankingsData, data) {
    let maxPercentage = 100, barDifference = data.value === 20 ? 4 : 8
    rankingsData.forEach((item, index) => {
      if (index === 0) {
        item.width = maxPercentage
      } else {
        item.width = (rankingsData[index - 1].width - barDifference)
      }
    })
    rankingsData = rankingsData.map((m) => { return { ...m, width: `${m.width}%` } })
    return rankingsData
  }

  OpenModal(event) {

    let rankingType = event.dropDownSelection.rankingType === 'counties' ? 'county_code' : 'zip_code'
    this.rankingbarsInstance.barsListing = this.rankingbarsInstance.barsListing.map((m) => {
      return { ...m, export: m[rankingType] == event[rankingType] ? true : false }
    })
    this.rankingbarsInstance.openModal(rankingType == 'county_code' ? this.rankingbarsInstance.countyModalRef : this.rankingbarsInstance.modalRef)
  }

  setPdfFilters(selectedDropdownItem, apiData) {
    this.export_filters = {
      data: this.alphaFinderService.getItem(),
      selected_dropdown_item: selectedDropdownItem,
      country: { ... this.country, mapView: this.mapView },
      apiData: apiData
    }
  }


}
