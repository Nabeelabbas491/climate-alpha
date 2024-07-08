import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { IndexConstants } from 'app/index/index-constants';
import { BenchMarkParamType } from 'app/index/index-interface';
import { AppConstants } from 'app/shared/data/constants';
import { ClimatePriceService } from 'app/shared/services/climate-price.service';

@Injectable({
  providedIn: 'root'
})
export class SingleAssetPdfResolver implements Resolve<boolean> {

  constructor(private _climatePriceService: ClimatePriceService) { }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    const propertyId = route.params['propertyId']
    const scenario = route.params['scenario']
    const userId = route.queryParamMap.get('userId')
    var risk = await this.getRisk({ propertyId, scenario, userId })
    const meta = risk.meta
    var resilience = await this.getResilience({ propertyId, scenario, userId })
    let payLoad = IndexConstants.getBenchMarkParams({ h306: risk['meta'].h3_06, scenario, })
    var benchmark = await this._climatePriceService.getRiskBenchMark(payLoad)
    return {
      mapLayer: AppConstants.SINGLE_ASSET_MAP_LAYER,
      mapInitialZoom: 17,
      risk: risk,
      resilience: resilience,
      benchmark: benchmark,
      latLng: [risk?.meta?.latitude, risk?.meta?.longitude],
      scenario: scenario,
      dataVersion: risk.data_version,
      address: `${meta.address}, ${meta.city}, ${meta.state ? meta.state + "," : ''} ${meta.zip_code ? meta.zip_code + "," : ''} ${meta.country}`,
      propertyName: `${meta.title ? meta.title + "," : ''} ${meta.address}, ${meta.city}, ${meta.state ? meta.state + "," : ''} ${meta.zip_code ? meta.zip_code + "," : ''} ${meta.country}`,
    };
  }

  async getRisk({ propertyId, scenario, userId }) {
    try {
      const risk = await this._climatePriceService.getRiskData(propertyId, scenario, userId)
      return risk
    } catch (e) {
      return null
    }
  }

  async getResilience({ propertyId, scenario, userId }) {
    try {
      const resilience = await this._climatePriceService.getResilienceRiskData(propertyId, scenario, userId)
      return resilience
    } catch (e) {
      return null
    }
  }

}
