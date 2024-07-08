import { AppConstants } from "app/shared/data/constants";
import { BenchMarkParamType, FeatureType, Impact, ImpactType, IndicatorColor, ScoreType, ToggleItem } from "./index-interface";
export class IndexConstants {

    public static Indicators_Dict = {
        "Overall": { icon: 'assets/img/svg/location-impact/overall.svg' },
        "Heat Stress": { icon: 'assets/img/svg/location-impact/heat-stress.svg' },
        "Drought": { icon: 'assets/img/svg/location-impact/drought.svg' },
        "Hurricane Wind": { icon: 'assets/img/svg/location-impact/hurricane-wind.svg' },
        "Inland Flooding": { icon: 'assets/img/svg/location-impact/inland-flooding.svg' },
        "Coastal Flooding": { icon: 'assets/img/svg/location-impact/coastal-flooding.svg' },
        "Wildfire": { icon: 'assets/img/svg/location-impact/wild-fire.svg' }
    }

    public static Score_Keys: { [key in ScoreType]: { key: ScoreType, unit, tickUnit } } = {
        Impact: { key: 'Impact', unit: '%', tickUnit: '%' },
        Score: { key: 'Score', unit: "/100", tickUnit: '' }
    }


    public static Scenarios = [
        { label: 'SSP2-4.5', value: "SSP245", icon: 'assets/img/svg/smile.svg', name: 'Lower Emission', showSpinner: false },
        { label: 'SSP3-7.0', value: "SSP370", icon: 'assets/img/svg/meh.svg', name: 'Medium Emission', showSpinner: false },
        { label: 'SSP5-8.5', value: "SSP585", icon: 'assets/img/svg/frown.svg', name: 'Higher Emission', showSpinner: false }
    ]

    public static DefaultScenario = this.Scenarios[1].value

    public static riskTimePeriods = [
        { label: 'Current', year: '(2020-2025)', key: 'Current', isFirst: true },
        { label: 'Early Century', year: '(2030-2035)', key: 'EarlyCentury' },
        { label: 'Mid Century', year: '(2045-2050)', key: 'MidCentury' },
        { label: 'End Century', year: '(2095-2100)', key: 'EndCentury', isLast: true },
    ]

    public static DefaultTimePeriod = this.riskTimePeriods[2]

    public static ResilienceFeatures = [
        { label: 'This Location', key: 'Local', },
        { label: 'Regional Average', key: 'Regional' },
        { label: 'National Average', key: 'National' },
    ];

    public static riskColors: IndicatorColor = {
        "Very Low Risk": {
            "mainColor": "rgba(0, 153, 153, 1)",
            "darkBackground": "rgba(0, 153, 153, 0.2)",
            "lightBackground": "rgba(0, 153, 153, 0.1)",
            "hover-class": "risk-hover-low",
            "marker": 'assets/img/svg/markers/green-marker.svg',
            "chip-class": 'green',
        },
        "Very Low": {
            "mainColor": "rgba(0, 153, 153, 1)",
            "darkBackground": "rgba(0, 153, 153, 0.2)",
            "lightBackground": "rgba(0, 153, 153, 0.1)",
            "hover-class": "risk-hover-low",
            "marker": 'assets/img/svg/markers/green-marker.svg',
            "chip-class": 'green',
        },
        "Low Risk": {
            "mainColor": "rgba(0, 153, 153, 1)",
            "darkBackground": "rgba(0, 153, 153, 0.2)",
            "lightBackground": "rgba(0, 153, 153, 0.1)",
            "hover-class": "risk-hover-low",
            "marker": 'assets/img/svg/markers/green-marker.svg',
            "chip-class": 'green',
        },
        "Low": {
            "mainColor": "rgba(0, 153, 153, 1)",
            "darkBackground": "rgba(0, 153, 153, 0.2)",
            "lightBackground": "rgba(0, 153, 153, 0.1)",
            "hover-class": "risk-hover-low",
            "marker": 'assets/img/svg/markers/green-marker.svg',
            "chip-class": 'green',
        },
        "Medium Risk": {
            "mainColor": "rgba(234, 136, 20, 1)",
            "darkBackground": "rgba(234, 136, 20, 0.2)",
            "lightBackground": "rgba(234, 136, 20, 0.1)",
            "hover-class": "risk-hover-medium",
            "marker": 'assets/img/svg/markers/yellow-marker.svg',
            "chip-class": 'yellow',
        },
        "Medium": {
            "mainColor": "rgba(234, 136, 20, 1)",
            "darkBackground": "rgba(234, 136, 20, 0.2)",
            "lightBackground": "rgba(234, 136, 20, 0.1)",
            "hover-class": "risk-hover-medium",
            "marker": 'assets/img/svg/markers/yellow-marker.svg',
            "chip-class": 'yellow',
        },
        "High Risk": {
            "mainColor": "rgba(129, 0, 0, 1)",
            "darkBackground": "rgba(234, 20, 20, 0.2)",
            "lightBackground": "rgba(234, 20, 20, 0.1)",
            "hover-class": "risk-hover-high",
            "marker": 'assets/img/svg/markers/red-marker.svg',
            "chip-class": 'red',
        },
        "High": {
            "mainColor": " rgba(129, 0, 0, 1)",
            "darkBackground": "rgba(234, 20, 20, 0.2)",
            "lightBackground": "rgba(234, 20, 20, 0.1)",
            "hover-class": "risk-hover-high",
            "marker": 'assets/img/svg/markers/red-marker.svg',
            "chip-class": 'red',
        },
        "Very High Risk": {
            "mainColor": " rgba(129, 0, 0, 1)",
            "darkBackground": "rgba(234, 20, 20, 0.2)",
            "lightBackground": "rgba(234, 20, 20, 0.1)",
            "hover-class": "risk-hover-high",
            "marker": 'assets/img/svg/markers/red-marker.svg',
            "chip-class": 'red',
        },
        "Very High": {
            "mainColor": " rgba(129, 0, 0, 1)",
            "darkBackground": "rgba(234, 20, 20, 0.2)",
            "lightBackground": "rgba(234, 20, 20, 0.1)",
            "hover-class": "risk-hover-high",
            "marker": 'assets/img/svg/markers/red-marker.svg',
            "chip-class": 'red',
        }
    };

    public static resiColors: IndicatorColor = {
        "Very Low Risk": {
            "mainColor": " rgba(129, 0, 0, 1)",
            "darkBackground": "rgba(234, 20, 20, 0.2)",
            "lightBackground": "rgba(234, 20, 20, 0.1)",
        },
        "Very Low": {
            "mainColor": " rgba(129, 0, 0, 1)",
            "darkBackground": "rgba(234, 20, 20, 0.2)",
            "lightBackground": "rgba(234, 20, 20, 0.1)",
        },
        "Low Risk": {
            "mainColor": " rgba(129, 0, 0, 1)",
            "darkBackground": "rgba(234, 20, 20, 0.2)",
            "lightBackground": "rgba(234, 20, 20, 0.1)",
        },
        "Low": {
            "mainColor": " rgba(129, 0, 0, 1)",
            "darkBackground": "rgba(234, 20, 20, 0.2)",
            "lightBackground": "rgba(234, 20, 20, 0.1)",
        },
        "Medium Risk": {
            "mainColor": "rgba(234, 136, 20, 1)",
            "darkBackground": "rgba(234, 136, 20, 0.2)",
            "lightBackground": "rgba(234, 136, 20, 0.1)",
        },
        "Medium": {
            "mainColor": "rgba(234, 136, 20, 1)",
            "darkBackground": "rgba(234, 136, 20, 0.2)",
            "lightBackground": "rgba(234, 136, 20, 0.1)",
        },
        "High Risk": {
            "mainColor": "rgba(0, 153, 153, 1)",
            "darkBackground": "rgba(0, 153, 153, 0.2)",
            "lightBackground": "rgba(0, 153, 153, 0.1)",
        },
        "High": {
            "mainColor": "rgba(0, 153, 153, 1)",
            "darkBackground": "rgba(0, 153, 153, 0.2)",
            "lightBackground": "rgba(0, 153, 153, 0.1)",
        },
        "Very High Risk": {
            "mainColor": "rgba(0, 153, 153, 1)",
            "darkBackground": "rgba(0, 153, 153, 0.2)",
            "lightBackground": "rgba(0, 153, 153, 0.1)",
        },
        "Very High": {
            "mainColor": "rgba(0, 153, 153, 1)",
            "darkBackground": "rgba(0, 153, 153, 0.2)",
            "lightBackground": "rgba(0, 153, 153, 0.1)",
        }
    };

    public static climateColors = {
        "Very Low Risk": {
            "mainColor": "#009999",
            "gradientColor": "#96cece"
        },
        "Very Low": {
            "mainColor": "#009999",
            "gradientColor": "#96cece"
        },
        "Low Risk": {
            "mainColor": "#009999",
            "gradientColor": "#96cece"
        },
        "Low": {
            "mainColor": "#009999",
            "gradientColor": "#96cece"
        },
        "Medium Risk": {
            "mainColor": "#EA8814",
            "gradientColor": "#eab68d"
        },
        "Medium": {
            "mainColor": "#EA8814",
            "gradientColor": "#eab68d"
        },
        "High Risk": {
            "mainColor": "#EA1414",
            "gradientColor": "#e46023"
        },
        "High": {
            "mainColor": "#EA1414",
            "gradientColor": "#e46023"
        },
        "Very High Risk": {
            "mainColor": "#EA1414",
            "gradientColor": "#e46023"
        },
        "Very High": {
            "mainColor": "#EA1414",
            "gradientColor": "#e46023"
        }
    };

    public static vulnerabilityColors = {
        "Very Low Vulnerability": {
            "mainColor": "#009999",
            "gradientColor": "#96cece"
        },
        "Very Low": {
            "mainColor": "#009999",
            "gradientColor": "#96cece"
        },
        "Low Vulnerability": {
            "mainColor": "#009999",
            "gradientColor": "#96cece"
        },
        "Low": {
            "mainColor": "#009999",
            "gradientColor": "#96cece"
        },
        "Medium Vulnerability": {
            "mainColor": "#EA8814",
            "gradientColor": "#eab68d"
        },
        "Medium": {
            "mainColor": "#EA8814",
            "gradientColor": "#eab68d"
        },
        "High Vulnerability": {
            "mainColor": "#EA1414",
            "gradientColor": "#e46023"
        },
        "High": {
            "mainColor": "#EA1414",
            "gradientColor": "#e46023"
        },
        "Very High Vulnerability": {
            "mainColor": "#EA1414",
            "gradientColor": "#e46023"
        },
        "Very High": {
            "mainColor": "#EA1414",
            "gradientColor": "#e46023"
        }
    };

    public static readinessColors = {
        "Very Low Readiness": {
            "mainColor": "#EA1414",
            "gradientColor": "#e46023"
        },
        "Very Low": {
            "mainColor": "#EA1414",
            "gradientColor": "#e46023"
        },
        "Low Readiness": {
            "mainColor": "#EA1414",
            "gradientColor": "#e46023"
        },
        "Low": {
            "mainColor": "#EA1414",
            "gradientColor": "#e46023"
        },
        "Medium Readiness": {
            "mainColor": "#EA8814",
            "gradientColor": "#eab68d"
        },
        "Medium": {
            "mainColor": "#EA8814",
            "gradientColor": "#eab68d"
        },
        "High Readiness": {
            "mainColor": "#009999",
            "gradientColor": "#96cece"
        },
        "High": {
            "mainColor": "#009999",
            "gradientColor": "#96cece"
        },
        "Very High Readiness": {
            "mainColor": "#009999",
            "gradientColor": "#96cece"
        },
        "Very High": {
            "mainColor": "#009999",
            "gradientColor": "#96cece"
        },
    };

    public static climateBoxColors = {
        "Very Low Risk": {
            "border": "#009999",
            "background": "rgba(0, 153, 153, 0.2)"
        },
        "Low Risk": {
            "border": "#009999",
            "background": "rgba(0, 153, 153, 0.2)"
        },
        "Medium Risk": {
            "border": "#EA8814",
            "background": "rgba(234, 136, 20, 0.2)"
        },
        "High Risk": {
            "border": "#EA1414",
            "background": "rgba(234, 20, 20, 0.2)"
        },
        "Very High Risk": {
            "border": "#EA1414",
            "background": "rgba(234, 20, 20, 0.2)"
        }
    };

    public static vulnerabilityBoxColors = {
        "Very Low Vulnerability": {
            "border": "#009999",
            "background": "rgba(0, 153, 153, 0.2)"
        },
        "Low Vulnerability": {
            "border": "#009999",
            "background": "rgba(0, 153, 153, 0.2)"
        },
        "Medium Vulnerability": {
            "border": "#EA8814",
            "background": "rgba(234, 136, 20, 0.2)"
        },
        "High Vulnerability": {
            "border": "#EA1414",
            "background": "rgba(234, 20, 20, 0.2)"
        },
        "Very High Vulnerability": {
            "border": "#EA1414",
            "background": "rgba(234, 20, 20, 0.2)"
        }
    };

    public static readinessBoxColors = {
        "Very Low Readiness": {
            "border": "#EA1414",
            "background": "rgba(234, 20, 20, 0.2)"
        },
        "Low Readiness": {
            "border": "#EA1414",
            "background": "rgba(234, 20, 20, 0.2)"
        },
        "Medium Readiness": {
            "border": "#EA8814",
            "background": "rgba(234, 136, 20, 0.2)"
        },
        "High Readiness": {
            "border": "#009999",
            "background": "rgba(0, 153, 153, 0.2)"
        },
        "Very High Readiness": {
            "border": "#009999",
            "background": "rgba(0, 153, 153, 0.2)"
        },
    };

    public static scenarios = {
        "Green": {
            "id": "Green",
            "title": "Optimistic Scenario",
            "sub_title": "SSP1 RCP3.4",
            "icon": AppConstants.SMILE_ICON,
            "summary": "The Optimistic scenario (SSP1 RCP3.4) represents a world with stable economic development and carbon emissions peaking and declining before 2040," +
                " with emissions constrained to stabilize lower than ~650 ppm CO2 and temperatures to 2.0–2.4°C by 2100."
        },
        "BAU": {
            "id": "BAU",
            "title": "Business as Usual Scenario",
            "sub_title": "SSP3 RCP4.5",
            "icon": AppConstants.MEH_ICON,
            "summary": "The Business as Usual (BAU) scenario  (SSP3 RCP4.5) represents a world with stable economic development and carbon emissions peaking and declining by 2045," +
                " with emissions constrained to stabilize at ~650 ppm CO2 and temperatures to 2.6–3.2°C by 2100."
        },
        "Bad": {
            "id": "Bad",
            "title": "Pessimistic Scenario",
            "sub_title": "SSP5 RCP8.5",
            "icon": AppConstants.FROWN_ICON,
            "summary": "The Pessimistic scenario (SSP5 RCP8.5) represents a fragmented world with uneven economic development, higher population growth," +
                " lower GDP growth, a lower rate of urbanization and steadily rising global carbon emissions," +
                " with CO2 concentrations reaching ~1370 ppm by 2100 and global mean temperatures increasing by 2.6–4.8°C relative to 1986–2005 levels."
        }
    };

    public static US_OPTIONS = ['us', 'usa', '', 'united states', 'america', 'united states of america']

    public static CA_OPTIONS = ['ca', 'canada']

    public static COUNTRY_OPTIONS = ['us', 'ca']

    public static colors(type: ImpactType) {
        switch (type) {
            case 'Physical Impact':
                return this.riskColors
            case 'Resilience-Adjusted Impact':
                return this.resiColors;
        }
    }

    public static PDFfeatures(type) {
        switch (type) {
            case 'risk':
                return this.riskTimePeriods
            case 'resilience':
                return this.ResilienceFeatures.map((m) => { return { ...m, key: m.key == 'Local' ? 'Current' : m.key } });
        }
    }

    public static getBenchMarkParams({ h306 = null, scenario = null }) {
        const params: BenchMarkParamType = {
            impact_type: 'all', benchmark_type: 'dynamic', scenario: scenario, h3_06: h306
        }
        return params
    }

    public static PDF_Content = {
        'Heat Stress': {
            explainer: 'Extreme heat and heatwaves significantly increase the energy consumption/operational costs required to maintain safe and comfortable building conditions and can also affect employee and tenant productivity. The Heat Stress Risk Score is comprised of the features below.',
            bestPractices: [
                'Energy Efficiency Improvements: Implement energy-efficient technologies in buildings and infrastructure to reduce heat-related energy consumption.',
                'Green Infrastructure: Integrate green spaces and cool roofs into developments to mitigate the urban heat island effect.',
                'Climate-Resilient Design: Incorporate climate-resilient design principles in new construction projects, considering heat-resistant materials and passive cooling techniques.',
                'Diversification of Investments: Diversify investments to include assets less susceptible to the negative impacts of extreme heat, such as renewable energy projects or sustainable agriculture.'
            ],
        },
        'Drought': {
            explainer: 'The increasing frequency and severity of dry spells and droughts imposes substantial stress on water systems in the form of reduced freshwater supply and chronic water shortages. The Drought Risk Score is comprised of the below features.',
            bestPractices: [
                'Water Conservation Measures: Implement water-efficient technologies and practices in buildings, agriculture, and other operations.',
                'Diversification of Water Sources: Explore alternative water sources, such as recycled water or rainwater harvesting, to reduce reliance on traditional water supplies.',
                'Risk Assessment and Monitoring: Conduct regular assessments of water-related risks and monitor water availability in areas where assets are located.',
                'Engagement with Stakeholders: Collaborate with local communities and authorities to develop and implement drought resilience strategies.'
            ]
        },
        'Hurricane Wind': {
            explainer: 'Warmer ocean temperatures lead to more intense hurricanes and tropical cyclones with stronger winds that cause severe physical damage and operational downtime due to loss of power or barriers to entry. The Hurricane Wind Risk Score is comprised of the features below.',
            bestPractices:
                [
                    'Infrastructure Resilience: Ensure that infrastructure is built or retrofitted to withstand extreme weather events, with a focus on hurricane-resistant materials and design.',
                    'Insurance and Risk Transfer: Utilize insurance and risk transfer mechanisms to mitigate financial losses associated with hurricane damage.',
                    'Emergency Preparedness and Response Planning: Develop and regularly update emergency response plans to ensure the safety of assets and personnel during hurricanes.',
                    'Geographic Diversification: Avoid over-concentration of assets in regions prone to hurricanes and diversify investments across less vulnerable areas.'
                ]
        },
        'Inland Flooding': {
            explainer: 'Intense precipitation and increased frequency of storms cause flash flooding that can have a devastating impact on buildings and other infrastructure, leading to higher costs through insurance premiums and deductibles. The Inland Flooding Risk Score is comprised of the features below.',
            bestPractices: [
                'Floodplain Management: Avoid development in flood-prone areas and implement sustainable land-use planning to reduce the risk of inland flooding.',
                'Stormwater Management: Implement effective stormwater management systems to reduce runoff and control flooding in urban and suburban areas.',
                'Early Warning Systems: Invest in advanced monitoring and early warning systems to provide timely information about potential flooding events.',
                'Community Engagement: Work with local communities to develop and implement flood resilience measures, such as community-based flood preparedness.'
            ]
        },
        'Coastal Flooding': {
            explainer: 'Global sea level rise increases the frequency and intensity of coastal inundations that cause structural damage to property and infrastructure, spike operational costs, and affect the ability to obtain insurance in vulnerable areas. Sea level rise may also lead to “stranded” assets in vulnerable areas. The Coastal Flooding Risk Score is comprised of the features below.',
            bestPractices: [
                'Adaptive Infrastructure: Build or retrofit infrastructure to be resilient to rising sea levels and storm surges, incorporating coastal protection measures.',
                'Ecosystem-Based Adaptation: Invest in and protect coastal ecosystems, such as mangroves and wetlands, which act as natural buffers against coastal flooding.',
                'Risk Modeling and Assessment: Use advanced modeling techniques to assess and understand the potential impacts of coastal flooding on assets.',
                'Regulatory Compliance: Stay informed about and comply with local and regional regulations related to coastal development and climate adaptation.'
            ]
        },
        'Wildfire': {
            explainer: 'Both natural and human-caused wildfires are magnified by dry spells and heatwaves, as well as topographical changes such as urban expansion, causing damage to buildings and utilities while affecting the ability to obtain insurance in vulnerable areas. Wildfires also impact occupant health due to air pollution. The Wildfire Risk Score is comprised of the features below. ',
            bestPractices: [
                'Vegetation Management: Implement vegetation management strategies, such as creating defensible space around assets to reduce the risk of wildfire spread.',
                'Emergency Preparedness: Develop and regularly update emergency evacuation plans for assets located in wildfire-prone areas.',
                'Collaboration with Authorities: Work closely with local firefighting authorities to enhance coordination and response capabilities.',
                'Insurance Coverage: Ensure that assets in wildfire-prone regions are adequately covered by insurance that includes wildfire risk.'
            ]
        },
    }



}