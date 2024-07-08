import { IndexConstants } from "./index-constants";

export interface ClimateIndex {
    Drought: Score,
    Fire: Score,
    Flood: Score,
    Heat: Score,
    Overall: Score,
    Store: Score,
}

export interface ReadinessIndex {
    Credit: Score,
    Crime: Score,
    Education: Score,
    Energy: Score,
    Health: Score,
    Readiness: Score,
    Spending: Score,
}

export interface VulnerabilityIndex {
    Age: Score,
    Coastal: Score,
    Infra: Score,
    Population: Score,
    Porosity: Score,
    Poverty: Score,
    Vulnerability: Score,
}


export interface ResilienceScore {
    Readiness: Score,
    Risk: Score,
    Vulnerability: Score,
}

export interface Score {
    Cat: string,
    Desc: string,
    Score: number,
    Title: string
}
export interface RIScore {
    longitude: number
    latitude: number
    resi: Impact,
    risk: Impact
}
export interface Impact {
    "Overall Rating": string;
    "Overall Score": string;
    Indicators: Indicator[]
    response?: LocationImpact;
    Headline: GlobalHeadline
}
export interface Indicator {
    features: Feature[]
    headline: Headline
}
export interface Headline {
    Cat: string,
    Explainer: string,
    Score: number,
    Title: string
}
export interface Feature {
    EarlyCentury?: number | null | string,
    EndCentury?: number | null | string,
    MidCentury?: number | null | string,
    Average?: number | null | string,
    Current?: number | null | string,
    BAU?: number | null | string,
    Higher?: number | null | string,
    Historic?: number | null | string,
    Lower?: number | null | string,
    Local?: number | null | string,
    National?: number | null | string,
    Regional?: number | null | string,
    Description: string,
    Tooltip: string,
    Unit: string
}

export interface ToggleItem {
    label: string,
    year?: string,
    key: string,
    isFirst?: boolean,
    isLast?: boolean
}

export interface IndicatorColor {
    "Very Low Risk": ColorType,
    "Very Low": ColorType,
    "Low Risk": ColorType,
    "Low": ColorType,
    "Medium Risk": ColorType,
    "Medium": ColorType,
    "High Risk": ColorType,
    "High": ColorType,
    "Very High Risk": ColorType,
    "Very High": ColorType,
}

export interface ColorType {
    mainColor: string
    darkBackground: string
    lightBackground: string
    "hover-class"?: string
    marker?: string
    "chip-class"?: string
}

export interface LocationImpact {
    Benchmark?: Benchmark[],
    Headline: GlobalHeadline,
    Indicators: Indicator[]
    geoids: { h3_04: string }
}

export interface GlobalHeadline {
    Cat: PhysicalImpactCategories,
    Explainer: string
    Impact: PhysicalImpactCategories,
    Score: PhysicalImpactCategories,
    Title: string
}

export interface PhysicalImpactCategories {
    Current: string
    EarlyCentury: string
    MidCentury: string
    EndCentury: string
}

export interface Benchmark {
    Title: string,
    Desc: string,
    Impact: Ticks
    Score: Ticks
}

export interface Ticks {
    min: number,
    mean: number,
    max: number
}

export interface sliderOption {
    Score: number[]
    Impact: number[]
    label: string
    tickIndexForLabel: number,
}

export interface GlobalOverview {
    latitude?: number
    longitude?: number
    resilience: LocationImpact
    risk: LocationImpact
    scenario?: string
}

export type ScoreType = "Impact" | 'Score'

export type ImpactType = "Physical Impact" | "Resilience-Adjusted Impact"

export type FeatureType = "Global" | 'US'

export interface BenchMarkParamType {
    impact_type: 'risk' | 'resilience' | "all",
    scenario: string,
    benchmark_type: 'static' | 'dynamic',
    h3_06?: string
}

export interface PDFReport {
    type: ImpactType,
    // colors: IndicatorColor,
    // features: ToggleItem[],
    // pdfContent: {
    //     [key: string]: {
    //         bestPractices: string[]
    //     }
    // },
    response: LocationImpact
    nationalBenchMark?: Benchmark
}


export interface SelectedBenchMarkEvent {
    risk: Benchmark | null | undefined
    resilience: Benchmark | null | undefined
}

