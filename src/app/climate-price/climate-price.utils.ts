export class ClimatePrice {

    public static GlobalMapView = [32, -82]

    public static Default_Year = 2035

    public static Default_Country = 'US'

    public static dbName = 'portfolio-analytics'

    public static Error_Msg_Comparison = "Please wait while data is loading!"

    public static colors = {
        "Low": {
            "color": '#EA8814',
            "background": 'rgba(234, 136, 20, 0.2)'
        },
        "Medium": {
            "color": '#EA8814',
            "background": 'rgba(234, 136, 20, 0.2)'
        }
    }

    public static isComarisonComponent = () => window.location.pathname.includes('comparison')


}