import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AppConstants } from 'app/shared/data/constants';
import * as cloneDeep from "lodash/cloneDeep";
import { AlphaRankingMainComponent } from '../alpha-ranking-main.component';
@Component({
  selector: 'app-alpha-search-canada',
  templateUrl: './../alpha-ranking-main.component.html',
  styleUrls: ['./../alpha-ranking-main.component.scss']
})
export class AlphaSearchCanadaComponent extends AlphaRankingMainComponent implements OnInit {

  mapView = AppConstants.CA_MAP_VIEW
  dropDownList = [
    { title: 'Show Top 10 Census Tract', value: 10, rankingType: 'census_tract', name: 'Census Tract' },
    { title: 'Show Top 20 Census Tract', value: 20, rankingType: 'census_tract', name: 'Census Tract' },
  ]
  placeholder = 'Show Top 20 Census Tract'
  showExportButtonsFooter: boolean = false

  ngOnInit(): void {
    this.getSelectedData()
  }

  async fetchApi(data) {
    this.response = await this.alphaFinderService.getAlphaSearchCanada(data)
  }

  getDictioneryForMapAndRakingBars(selectedDropdownItem) {

    function getMapTooltip(location, color, rank) {
      let tooltipString = `<b>${location['csd']} </b> <br> <br> <span"> ${location['ctuid']}</span> <br> <span style="color:${color}"> Rank ${rank}</span> `
      return `${tooltipString}`
    }

    let rankingsData = []
    rankingsData = cloneDeep(this.response)
    rankingsData = rankingsData['zip_codes'].map((item, index) => {
      return {
        ...item,
        export: false,
        disabled: false,
        dropDownSelection: selectedDropdownItem,
        color: this.getcolor(index + 1, selectedDropdownItem.value),
        name: `${item.csd}, ${item.ctuid}`,
        rank: index + 1
      }
    })

    rankingsData = rankingsData.map((item, idx) => {
      return { ...item, mapToolTip: getMapTooltip(item, item.color, item.rank) }
    })

    return rankingsData
  }

  OpenModal(event: any): void { }

}
