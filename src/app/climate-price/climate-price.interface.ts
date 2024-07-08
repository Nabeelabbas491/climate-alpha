// import { ReadinessIndex, ClimateIndex, VulnerabilityIndex } from "app/index/index-interface"

import { GlobalPhysicalImpact } from "app/location-analytic/location-analytics.interface"

export interface TierOne {
    uuid: string
    countries?: Array<string>
    created_at?: string
    existing_portfolio?: null | boolean | undefined
    new_portfolio_name?: null | boolean | undefined
    portfolio_description?: string
    portfolio_name?: string
    property_count?: number
    tier_headings: TierHeadings
    user?: number
}
export interface Tier {
    uuid: string,
    name: string
}

export interface TierHeadings {
    tier1: string,
    tier2: string,
    tier3: string,
    tier4: string
}

export interface UserFilter {
    uuid?: string,
    name?: string,
    file: string | null | boolean,
    tier2: string | null | boolean,
    tier3: string | null | boolean,
    tier4: string | null | boolean,
    selected?: boolean,
    country: string,
    state: Array<string>
    city: Array<string>,
    asset_class: Array<string>
}

export interface AssetOverview {
    future_return?: number
    historic_return?: number,
    total_time?: number
    yearly_data?: GraphSingleYear[]
    benchmark_averages: Array<WeightedAvg>
    benchmark?: BenchMark[]
}

export interface WeightedAvg {
    PHYSICAL_IMPACT_MAX: string | number
    PHYSICAL_IMPACT_MEAN: string | number
    PHYSICAL_IMPACT_MIN: string | number
    PROPERTYTYPE: string
    RES_ADJ_IMPACT_MAX: string | number
    RES_ADJ_IMPACT_MEAN: string | number
    RES_ADJ_IMPACT_MIN: string | number
    SCENARIO_TYPE: string,
    Title: string
    Tooltip: string
    YEAR: string | number
}

export interface BenchMark {
    PHYSICAL_IMPACT_MAX: number
    PHYSICAL_IMPACT_MEAN: number
    PHYSICAL_IMPACT_MIN: number
    RES_ADJ_IMPACT_MAX: number
    RES_ADJ_IMPACT_MEAN: number
    RES_ADJ_IMPACT_MIN: number
    SCENARIO_TYPE?: string
    YEAR?: number
}

export interface GraphSingleYear {
    BASEINDEX?: number
    HPI?: number
    PHYSICAL_HPI?: number
    PHYSICAL_IMPACT: number
    PHYSICAL_VAL?: number
    RES_ADJ_HPI?: number
    RES_ADJ_IMPACT: number
    RES_ADJ_VAL?: number
    SCENARIO_TYPE?: string
    VALUATION?: number
    YEAR?: number
    lapsed_year?: number
    physical_aal: number
    resilience_aal: number
}

export interface ImpactScore extends GraphSingleYear, BenchMark {
    future_return?: number
    historic_return?: number
    ticks?: WeightedAvg
}

export interface AnalyticTableResponse {
    data: Array<AnalyticTable>
    national_avg: NationAverage
    properties_count: number
}
export interface AnalyticTable {
    uuid: string
    h3_08: string
    physical_impact: number
    purchase_price: string
    readiness_score: number
    res_adj_impact: number
    risk_score: number
    scenario: string
    show: boolean
    title: string
    vulnerability_score: number
}

export interface NationAverage {
    avg_physical_impact: number
    avg_readiness_score: number
    avg_res_adj_impact: number
    avg_risk_score: number
    avg_vulnerability_score: number
}

export interface Asset {
    address: string
    city: string,
    state: string,
    title: string,
    latitude: number | string
    longitude: number | string
    property_id: string;
    res_adj_impact: number;
    color: string
    scenario: string;
    location: string;
    zip_code: string,
    country: string,
    physical_impact: number
    h3_06: string
    overall_score: number
}

export interface Scenario {
    label: string,
    value: string
}

export interface ImpactAnalysisSummary {
    data: summaryData
    expanded?: boolean
    level?: number
    topParentId?: string | unknown
    paddingLeft?: string
    class?: string
    children: Array<ImpactAnalysisSummary>
}

export interface summaryData {
    uuid: string,
    title: string,
    parent: string | null,
    total_risk_score: number,
    total_readiness_score: number,
    total_purchase_price: number,
    total_res_adj_impact: number,
    total_physical_impact: number,
    total_vulnerability_score: number,
    avg_risk_score: number,
    avg_readiness_score: number,
    avg_res_adj_impact: number,
    avg_physical_impact: number,
    avg_vulnerability_score: number,
    avg_market_value: number
}

export interface BenchMarkDropdown {
    id: string,
    label: string | any
}

export interface GlobalPhysicalImpactSingleAsset {
    latitude: number,
    longitude: number,
    risk245: GlobalPhysicalImpact
    risk370: GlobalPhysicalImpact
    risk585: GlobalPhysicalImpact
}


