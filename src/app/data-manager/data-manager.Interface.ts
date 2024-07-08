export interface DataMangerSummary {
    data: TableRow
    expanded?: boolean
    level?: number
    topParentId?: string | unknown
    paddingLeft?: string
    class?: string
    children: Array<DataMangerSummary>
    checkbox: boolean
    editRow: boolean
}

export interface TableRow {
    created_at: string
    name: string
    parent: string | null | unknown
    property_count: number
    uuid: string
}

export interface AssetTable {
    uuid: string,
    asset: string,
    property_name: string,
    portfolio_name: string,
    country_formatted: string,
    tier_4_name: string | number,
    tier_3_name: string | number,
    tier_2_name: string | number,
    tier_3_id: string,
    tier_2_id: string
    is_processed: string,
    h3_06: string | number,
    h3_07: string | number,
    h3_08: string | number,
    h3_09: string | number,
    h3_10: string | number,
    title: string
    address: string,
    city: string,
    state: string,
    zip_code: string | number,
    country: string,
    asset_class: string,
    longitude: number | string,
    latitude: number | string,
    capital_contribution: null | string | number,
    percentage_ownership: null | string | number,
    year_built: null | string | number,
    current_price: null | string | number,
    year_acquired: null | string | number,
    year_valuation: null | string | number,
    valuation: number | string,
    purchase_price: null | string | number,
    user: string | number,
    file: string,
    tier_4: string,
    checked: false,
    editColumn: boolean,
    disableTier2: boolean,
    disableTier3: boolean
    disableTier4: boolean
    tier2List: any,
    tier3List: any,
    tier4List: any
}

export interface AssetTableEvent {
    type: string,
    data?: Object | unknown | any
}
