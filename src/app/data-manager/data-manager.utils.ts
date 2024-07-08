export class DataManager {

    public static reports_type = {
        'Portfolio Analysis': 'portfolio-analysis',
        'All': ['alpha-finder', 'scenario-forecaster'],
        'Alpha Finder': 'alpha-finder',
        'Scenario Forecaster': 'scenario-forecaster'
    }

    public static Data_Room_Per_Page_Records = 10

    public static Events = {
        newPortfolio: 'update tier one dropdown listing with newly created portfolio',
        fileUpload: 'reset form group and filters section',
        crud: 'update asset count and call dropdowns apis',
        resetTier2: 'reset all dropdowns except Tier1',
        resetTier3: 'reset all dropdowns except Tier1 and Tier2',
        resetTier4: 'reset all dropdowns except Tier1, Tier2 and Tier3',
    }

    public static barGraphColors = {
        postiveValuesColorsCodes: [
            { id: 1, code: '#0B5858' },
            { id: 2, code: '#0D7B7B' },
            { id: 3, code: '#009999' },
            { id: 4, code: '#04B1B1' },
            { id: 5, code: '#09CCCC' },
            { id: 6, code: '#5ADED6' },
            { id: 7, code: '#98E8E2' },
            { id: 8, code: '#B9ECE9' },
        ],
        negativeValuesColorsCodes: [
            { id: 1, code: '#FFE27C' },
            { id: 2, code: '#FFD12F' },
            { id: 3, code: '#F4A71E' },
            { id: 4, code: '#EC8814' },
            { id: 5, code: '#BF5000' },
        ],
    };

    public static getColorsArray(data, key) {
        let negativeValuesList = data.filter((item) => {
            return item[key] < 0
        })
        let postiveValuesList = data.filter((item) => {
            return item[key] >= 0
        })

        let positiveClrIdentifier = Math.ceil(postiveValuesList.length / this.barGraphColors.postiveValuesColorsCodes.length)
        let negativeClrIdentifier = Math.ceil(negativeValuesList.length / this.barGraphColors.negativeValuesColorsCodes.length)
        let count = 0, colorCodeId = 0, postiveClrs = [], negativeClrs = []
        postiveValuesList.forEach(() => {
            if (count % positiveClrIdentifier == 0) {
                colorCodeId++
            }
            let color = this.barGraphColors.postiveValuesColorsCodes.find((m) => m.id == colorCodeId).code
            postiveClrs.push(color)
            count++
        })
        count = 0, colorCodeId = 0
        negativeValuesList.forEach(() => {
            if (count % negativeClrIdentifier == 0) {
                colorCodeId++
            }
            let color = this.barGraphColors.negativeValuesColorsCodes.find((m) => m.id == colorCodeId).code
            negativeClrs.push(color)
            count++
        })
        return [...postiveClrs, ...negativeClrs]
    }

}