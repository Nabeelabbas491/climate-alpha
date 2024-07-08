import { LAIndicators } from "./location-analytics.interface"

export class LocationAnalytic {

    public static notAvailable = "N/A"
    public static bgColorUnset: 'unset'

    // public static indicatorsInfo: { [key: string]: { title: string, color: string, type: string } } = {
    //     coastal_flooding: { type: 'risk', title: 'Coastal Flooding', color: 'rgba(129, 0, 0, 1)' },
    //     inland_flooding: { type: 'risk', title: 'Inland Flooding', color: 'rgba(129, 0, 0, 1)' },
    //     wind: { type: 'risk', title: 'Hurricane', color: 'rgba(129, 0, 0, 1)' },
    //     fire: { type: 'risk', title: 'Fire', color: 'rgba(129, 0, 0, 1)' },
    //     heat: { type: 'risk', title: 'Heat', color: 'rgba(129, 0, 0, 1)' },
    //     drought: { type: 'risk', title: 'Drought', color: 'rgba(129, 0, 0, 1)' },
    //     economic_momentum: { type: 'resilience', title: 'Economic  Momentum', color: 'rgba(16, 103, 103, 1)' },
    //     wellness: { type: 'resilience', title: 'Location Wellness', color: 'rgba(16, 103, 103, 1)' },
    //     social_robustness: { type: 'resilience', title: 'Social Robustness', color: 'rgba(16, 103, 103, 1)' },
    //     energy_reliability: { type: 'resilience', title: 'Energy Reliability', color: 'rgba(16, 103, 103, 1)' },
    //     energy_transition: { type: 'resilience', title: 'Carbon Intensity', color: 'rgba(16, 103, 103, 1)' },
    //     infrastructure: { type: 'resilience', title: 'Infrastructure', color: 'rgba(16, 103, 103, 1)' },
    // }

    // public static USAnalysis({ response, locations }) {
    //     let riScore = { risk: { overAll: response.risk.overall_data }, resi: { overAll: response.resilience.overall_data } }
    //     locations.forEach((m) => {
    //         riScore.risk[m.identifier] = { Indicators: [] }, riScore.resi[m.identifier] = { Indicators: [] }
    //     })
    //     let data: LAIndicators = { ...response.risk, ...response.resilience }
    //     for (let key in data) {
    //         let rowValues = []
    //         data[key] = { ...data[key], ...this.indicatorsInfo[key] }
    //         data[key].data?.forEach((m) => {
    //             const identifier = Object.keys(m)[0]
    //             this.indicatorsInfo[key].type == 'risk' ? riScore.risk[identifier].Indicators.push(m[identifier].details) : riScore.resi[identifier].Indicators.push(m[identifier].details)
    //             let location = locations.find(m => m.identifier == identifier)
    //             // in case of line graph there is list of objects with value for each year, currently showing value in table for 2021
    //             if (Array.isArray(m[identifier].scores) || Array.isArray(m[identifier])) {
    //                 const allYearsData = m[identifier].scores?.length ? m[identifier].scores.map((m) => { return { ...m, year: parseInt(m.year) } }) : m[identifier]
    //                 const object = allYearsData.find(m => m.year == '2021')
    //                 const color = this.getColor(object?.score, data[key].type)
    //                 rowValues.push(object?.score)
    //                 data[key].selectedLocations = {
    //                     ...data[key].selectedLocations, [identifier]: { ...location, value: object?.score, color: color, allYearsData: allYearsData }
    //                 }
    //             } else {
    //                 const color = this.getColor(m[identifier].score, data[key].type)
    //                 rowValues.push(m[identifier].score)
    //                 data[key].selectedLocations = { ...data[key].selectedLocations, [identifier]: { ...location, value: m[identifier].score, color: color, } }
    //                 // this.indicators[key][identifier] = { ...location, value: m[identifier] }
    //             }
    //         })
    //         data[key].disable = !rowValues.filter(Boolean).length
    //     }
    //     // giving the final object ordering as per figma
    //     let indicators;
    //     for (let key in this.indicatorsInfo) {
    //         indicators = { ...indicators, [key]: data[key] }
    //     }
    //     return { indicators: indicators, riScore: riScore }
    // }

    // public static getColor(value, type) {
    //     if (!value) return;
    //     switch (type) {
    //         case 'resilience':
    //             if (value < 40) {
    //                 return '#f3e6e6'
    //             } else if (value >= 40 && value <= 60) {
    //                 return '#fdf7e8'
    //             } else if (value > 60) {
    //                 return '#e6f5f5'
    //             }
    //             break;
    //         case 'risk':
    //             if (value < 40) {
    //                 return '#e6f5f5'
    //             } else if (value >= 40 && value <= 60) {
    //                 return '#fdf7e8'
    //             } else if (value > 60) {
    //                 return '#f3e6e6'
    //             }
    //             break;
    //     }
    // }

}