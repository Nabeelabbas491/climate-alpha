import { BenchMark, BenchMarkDropdown } from "app/climate-price/climate-price.interface"
import { Benchmark, GlobalHeadline, GlobalOverview, Indicator, LocationImpact } from "app/index/index-interface"

export interface Resilience {
    economic_momentum: SingleIndicator,
    energy_reliability: SingleIndicator,
    energy_transition: SingleIndicator,
    infrastructure: SingleIndicator,
    social_robustness: SingleIndicator,
    wellness: SingleIndicator
    overall_data: OverallRating
}
export interface Risk {
    heat: SingleIndicator
    drought: SingleIndicator
    wind: SingleIndicator
    inland_flooding: SingleIndicator
    coastal_flooding: SingleIndicator
    fire: SingleIndicator
    overall_data: OverallRating
}

export interface OverallRating {
    [key: string]: {
        rating: string | string[],
        score: number | string
    },
}
export interface IndicatorData {
    [key: string]: {
        details: Indicator,
        scores?: Array<{ year: string | number, score: string | number }> | number
        score?: Array<{ year: string | number, score: string | number }> | number
    },
}
export interface SingleIndicator {
    content: {
        graph_type: string,
        methodology: string,
        sources: string[]
    }
    data: Array<IndicatorData>,
    color?: string,
    selectedLocations?: {
        [key: string]: LALocation
    }
    title?: string
    key?: string
    type?: string,
}
export interface LALocation {
    checked?: boolean,
    color?: string,
    county?: string,
    identifier?: string,
    latlng: number[],
    name?: string,
    value?: number
    zip_code?: string | number,
    type?: string
    showSpinner?: boolean,
    graphLineColor?: string,
    disabled?: boolean,
    country?: string,
    city?: string,
    state?: string,
    added?: boolean,
    bbox?: Array<number>,
    shapefile?: string,
    allYearsData?: Array<{ year: string | number, score: string | number }>
}

export interface LAIndicators extends Resilience, Risk { }
export interface LAResponse {
    risk: Risk
    resilience: Resilience
}
export interface GlobalPhysicalImpact {
    global_address: string,
    resilience: {},
    risk: GlobalRisk
    type: string
}

export interface GlobalRisk {
    Benchmark: Benchmark[],
    Indicators: Array<Indicator>,
    'Overall Impact': number,
    'Overall Rating': string[] | string,
    'Overall Score': number | string,
    geoids: { h3_04: string }
}
export interface LocationBenchmark {
    sliderOptions: {
        Score: Array<number | string>,
        Impact: Array<number | string>,
        id: string,
        label: string,
        tickIndexForLabel: number
    }
}

export interface Meta {
    [key: string]: {
        graph_type: string,
        methodology: string,
        sources: string[]
    }
}

export interface TableData {
    [key: string]: {
        type: string,
        disableEntireRow?: boolean,
        selectedLocations: {
            [key: string]: {
                value: string | number,
                bgColor: string,
                headline: GlobalHeadline | null
                locationData: LALocation
            },
        }
    }
}

export interface SelectedLocationsData {
    [key: string]: {
        locationData: LALocation,
        response: GlobalOverview
    }
}

export interface LocationAnalyticsResponse {
    meta: Meta,
    risk: LocationImpact,
    resilience: LocationImpact,
    h3_06: any
    benchMark: {
        risk: Benchmark
        resilience: Benchmark
    }
}







