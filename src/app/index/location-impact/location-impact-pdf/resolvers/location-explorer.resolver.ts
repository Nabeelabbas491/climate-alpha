import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { IndexConstants } from 'app/index/index-constants';
import { AppConstants } from 'app/shared/data/constants';
import { ClimatePriceService } from 'app/shared/services/climate-price.service';
import { LocationAnalyticsService } from 'app/shared/services/location-analytics.service';

@Injectable({
  providedIn: 'root'
})
export class LocationExplorerPdfResolver implements Resolve<boolean> {

  constructor(private _locationAnalyticsService: LocationAnalyticsService, private _climatePriceService: ClimatePriceService) { }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    let body = Object.assign({}, route.queryParamMap['params'])
    if (body.hasOwnProperty('bbox')) body.bbox = true
    body = { ...body, locations: JSON.parse(body.locations), latlng: JSON.parse(body.latlng), zoomLevel: parseInt(body.zoomLevel) }
    let score: any = await this._locationAnalyticsService.getLocationAnalysisData(body)
    let [risk, resilience] = [score.risk, score.resilience]
    let payLoad = IndexConstants.getBenchMarkParams({ h306: score.h3_06, scenario: body.scenario })
    var benchmark = await this._climatePriceService.getRiskBenchMark(payLoad)
    if (body.shapefileType) {
      var shapefile = {
        type: body.shapefileType,
        coordinates: JSON.parse(body.shapefileCoordinate)
      }
    }
    return {
      ...body,
      mapLayer: AppConstants.LOCATION_EXPLORER_MAP_LAYER,
      mapInitialZoom: 2,
      risk: risk,
      resilience: resilience,
      benchmark: benchmark,
      latLng: body.latlng,
      scenario: body.scenario,
      dataVersion: score.data_version,
      shapefile: shapefile,
      propertyName: body.name
    };
  }
}
