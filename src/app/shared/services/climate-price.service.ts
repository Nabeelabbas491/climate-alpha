import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AnalyticTableResponse, Asset, AssetOverview, Tier, TierOne, UserFilter } from 'app/climate-price/climate-price.interface';
import { AuthService } from './auth.service';
import { BenchMarkParamType, ScoreType, ToggleItem } from 'app/index/index-interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClimatePriceService {

  public benchMarkValueObs$ = new BehaviorSubject<any>(undefined);

  multiAssetMapSelectedLabel: string;
  selectedScenario: any;
  selectedBenchMark: string
  mapViewData: any;  // maintain zoom level of multi asset map

  selectedTimePeriod: ToggleItem;
  selectedScoreType: ScoreType;
  selectedIndicator;
  selectedIndicatorTab: string;

  resetVariables() {
    this.multiAssetMapSelectedLabel = undefined
    this.selectedScenario = undefined;
    this.selectedBenchMark = undefined
    this.mapViewData = undefined
    this.selectedIndicator = undefined;
    this.selectedIndicatorTab = undefined;
    this.selectedTimePeriod = undefined;
    this.selectedScoreType = undefined
  }

  constructor(private _apiService: ApiService, private _authServce: AuthService) { }

  toggleAccordian(panelId, arrowId) {
    let transitionTime = '0.3s'
    const panel = document.getElementById(panelId);
    panel.style.transition = `max-height ${transitionTime} ease-out`
    const arrow = document.getElementById(arrowId)
    arrow.style.transition = `${transitionTime} ease-out`
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  }

  getClientFiles(): Promise<TierOne[]> {
    return new Promise((resolve, reject) => {
      this._apiService.get(`client/files`).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error.error)
      })
    })
  }

  getTier(data): Promise<Tier[]> {
    return new Promise((resolve, reject) => {
      this._apiService.post(`client/filter_api`, data).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error.error)
      })
    })
  }

  getAssetFilters(data): Promise<{ [key: string]: Array<string> }> {
    return new Promise((resolve, reject) => {
      this._apiService.post(`client/asset_filters`, data).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error.error)
      })
    })
  }

  getOverView(): Promise<AssetOverview> | AssetOverview {
    return new Promise((resolve, reject) => {
      this._apiService.get('portfolio_analytics/overview').subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error.error)
      })
    })
  }

  getOverViewByPropertyId(id): Promise<AssetOverview> {
    return new Promise((resolve, reject) => {
      this._apiService.get(`portfolio_analytics/overview?property_id=${id}`).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error.error)
      })
    })
  }

  getUserSavedFilters(): Promise<UserFilter[]> {
    return new Promise((resolve, reject) => {
      this._apiService.get('client/saved_filters').subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error.error)
      })
    })
  }

  saveFilter(body): Promise<UserFilter> {
    return new Promise((resolve, reject) => {
      this._apiService.post('client/saved_filters', body).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error.error)
      })
    })
  }

  getSavedFilters() {
    return new Promise((resolve, reject) => {
      this._apiService.get(`portfolio_analytics/saved_filters_api`).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error.error)
      })
    })
  }

  updateFilter(body) {
    return new Promise((resolve, reject) => {
      this._apiService.post(`client/saved_filters/${body.uuid}/update/`, body).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error.error)
      })
    })
  }

  deleteFilter(uuid) {
    return new Promise((resolve, reject) => {
      this._apiService.delete(`client/saved_filters/${uuid}/delete/`).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error.error)
      })
    })
  }


  getMultiAssets({ page, pageSize, search, sortBy, sortOrder, scenario }): Promise<AnalyticTableResponse> {
    return new Promise((resolve, reject) => {
      this._apiService.get(`portfolio_analytics/properties_filtered?page=${page}&page_size=${pageSize}&search=${search}&sort_by=${sortBy}&order_by=${sortOrder}&scenario=${scenario}`).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error.error)
      })
    })
  }

  applyFilters(body): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this._apiService.post('portfolio_analytics/apply_filter', body).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error.error)
      })
    })
  }

  getMapData(scenario): Promise<UserFilter[]> {
    return new Promise((resolve, reject) => {
      this._apiService.get(`portfolio_analytics/maps?scenario=${scenario}`).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error.error)
      })
    })
  }

  singleAssetMap({ id }): Promise<Asset[]> {
    return new Promise((resolve, reject) => {
      this._apiService.get(`portfolio_analytics/single_asset_map?property_id=${id}`).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error.error)
      })
    })
  }

  deleteFilters() {
    return new Promise((resolve, reject) => {
      this._apiService.get('portfolio_analytics/delete_filter').subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error.error)
      })
    })
  }

  getRiskData(id, secanrio, userId = undefined): Promise<any> {
    let url = `portfolio_analytics/risk?property_id=${id}&scenario=${secanrio}`
    url = userId ? `${url}&user_id=${userId}` : url
    return new Promise((resolve, reject) => {
      this._apiService.get(url).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error.error)
      })
    })
  }

  getResilienceRiskData(id, secanrio, userId = undefined): Promise<any> {
    let url = `portfolio_analytics/raj?property_id=${id}&scenario=${secanrio}`
    url = userId ? `${url}&user_id=${userId}` : url
    return new Promise((resolve, reject) => {
      this._apiService.get(url).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error.error)
      })
    })
  }



  hideSelectedPropertiesResult(body) {
    return new Promise((resolve, reject) => {
      this._apiService.post(`portfolio_analytics/property_visibility`, body).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error.error)
      })
    })
  }

  getSummaryData(body) {
    return new Promise((resolve, reject) => {
      this._apiService.post(`portfolio_analytics/overall_summary`, body).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error.error)
      })
    })
  }

  getPropertyDetails(id) {
    return new Promise((resolve, reject) => {
      this._apiService.get(`portfolio_analytics/property_detail/${id}`).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error.error)
      })
    })
  }

  getRiskBenchMark(params: BenchMarkParamType) {
    let url = `portfolio_analytics/benchmarks`
    for (let key in params) {
      url = `${url}${url.includes('?') ? '&' : '?'}${key}=${params[key]}`
    }
    return new Promise((resolve, reject) => {
      this._apiService.get(url).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error.error)
      })
    })
  }



  downloadData() {
    return new Promise((resolve, reject) => {
      this._apiService.get(`portfolio_analytics/download_api`).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error.error)
      })
    })
  }

  getDataManagerSummaryData(body) {
    return new Promise((resolve, reject) => {
      this._apiService.post(`client/summary_detail_api`, body).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error.error)
      })
    })
  }

  getGlobalOverview(scenario) {
    return new Promise((resolve, reject) => {
      this._apiService.get(`portfolio_analytics/overview?scenario=${scenario}`).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error.error)
      })
    })
  }

  updateRowsOfDataManagerSummary(body) {
    return new Promise((resolve, reject) => {
      this._apiService.patch(`client/update_tier`, body).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error.error)
      })
    })
  }

  createNewTier(body) {
    return new Promise((resolve, reject) => {
      this._apiService.post(`client/add_new_tier`, body).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error.error)
      })
    })
  }

  deleteRowsOfDataManagerSummary(body) {
    return new Promise((resolve, reject) => {
      this._apiService.deleteWithBody(`client/update_tier`, body).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error.error)
      })
    })
  }

  dublicateRowsOfDataManagerSummary(body) {
    return new Promise((resolve, reject) => {
      this._apiService.post(`client/duplicate_portfolios`, body).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error.error)
      })
    })
  }

  duplicateRowsDataManagerAssets(body) {
    return new Promise((resolve, reject) => {
      this._apiService.post(`client/move_properties_to_portfolio`, body).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error.error)
      })
    })
  }

  updateTierHeadings(body) {
    return new Promise((resolve, reject) => {
      this._apiService.patch(`client/update_tier_headings`, body).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error.error)
      })
    })
  }

  saveInLocalStorage(data) {
    this._authServce.isPublicLink() ?
      sessionStorage.setItem('portfolio-analytics-comparison-list', JSON.stringify(data)) :
      localStorage.setItem('portfolio-analytics-comparison-list', JSON.stringify(data))
  }

  getComparisonList() {
    const data = this._authServce.isPublicLink() ? JSON.parse(sessionStorage.getItem('portfolio-analytics-comparison-list')) :
      JSON.parse(localStorage.getItem('portfolio-analytics-comparison-list'))
    return data
  }

  deleteComparisonList() {
    localStorage.removeItem('portfolio-analytics-comparison-list')
  }

  onScroll() {
    // Show/hide the headers per user scroll direction
    const navbar = document.getElementById("app-header")
    const porftolioAnalyticsHeader = document.getElementById("portfolio-analytics-header");
    const navbarItems = document.getElementById("navbarItems")
    var sticky = porftolioAnalyticsHeader?.offsetTop;
    if (navbar && porftolioAnalyticsHeader && navbarItems) {
      if (window.pageYOffset > sticky) {
        // on scrolling towards bottom 
        navbarItems.style.transition = 'all 0.1s ease'
        if (porftolioAnalyticsHeader.offsetTop == 0) {
          navbarItems.style.visibility = 'visible'
        }
        navbarItems.style.paddingTop = '11px'
        navbarItems.style.top = '0px'
        navbar.style.visibility = 'hidden'
        porftolioAnalyticsHeader.style.top = "0px"
        porftolioAnalyticsHeader.style.paddingTop = '20px'
      } else {
        // when scrolled to top 
        navbarItems.style.visibility = 'hidden'
        navbarItems.style.paddingTop = '0px'
        navbarItems.style.top = '-40px'
        navbar.style.visibility = 'visible'
        porftolioAnalyticsHeader.style.top = "60px"
        porftolioAnalyticsHeader.style.paddingTop = 'unset'
      }
    }
  }


}
