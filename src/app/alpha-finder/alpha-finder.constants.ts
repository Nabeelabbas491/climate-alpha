export class AlphaFinderConstants {

    // colors for ranking bars and map pins
    public static topTwentyRankingColors = {
        '1': '#003333',
        '2': '#003333',
        '3': '#003333',
        '4': '#003333',
        '5': '#006666',
        '6': '#006666',
        '7': '#006666',
        '8': '#006666',
        '9': '#009999',
        '10': '#009999',
        '11': '#009999',
        '12': '#009999',
        '13': '#00DBDB',
        '14': '#00DBDB',
        '15': '#00DBDB',
        '16': '#00DBDB',
        '17': '#90E9E3',
        '18': '#90E9E3',
        '19': '#90E9E3',
        '20': '#90E9E3'
    }

    public static topTenRankingColors = {
        '1': '#003333',
        '2': '#003333',
        '3': '#006666',
        '4': '#006666',
        '5': '#009999',
        '6': '#009999',
        '7': '#00DBDB',
        '8': '#00DBDB',
        '9': '#90E9E3',
        '10': '#90E9E3',
    }

    public static countries = {
        /**
         * key name should be exactly as path name ,  path ( for url ) and value ( to pass value to backend )
         */
        'us': { path: 'us', value: "US" },   // united-states
        'ca': { path: 'ca', value: "CA" }   // canadas
    }

    public static disableExportforCountries = ['ca']

}

