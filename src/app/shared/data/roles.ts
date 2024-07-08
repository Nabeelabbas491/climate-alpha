
export class Role {

    public static ROLES: RolesType = {
        SUPER_ADMIN: 500,
        LOCATION_EXPLORER: 400,
        LOCATION_EXPLORER_TRIAL: 350,
        ALPHA_FINDER: 300,
        ALPHA_FINDER_TRIAL: 250,
        PDF: 110,
        PORTFOLIO_ANALYTICS: 100,
        PORTFOLIO_ANALYTICS_TRIAL: 99,
        SHAREABLE_LINK: 'shareable_link',
    }

    public static INVALID_REDIRECT_ROLE_PATH = {
        [this.ROLES.SUPER_ADMIN]: "/data-manager/assets",
        [this.ROLES.LOCATION_EXPLORER]: "/location-explorer",
        [this.ROLES.LOCATION_EXPLORER_TRIAL]: "/location-explorer",
        [this.ROLES.ALPHA_FINDER]: "/alpha-finder/dashboard/us",
        [this.ROLES.ALPHA_FINDER_TRIAL]: "/alpha-finder/dashboard/us",
        [this.ROLES.PDF]: "/data-manager/assets",
        [this.ROLES.PORTFOLIO_ANALYTICS]: "/data-manager/assets",
        [this.ROLES.PORTFOLIO_ANALYTICS_TRIAL]: "/location-explorer",
        [this.ROLES.SHAREABLE_LINK]: '/portfolio-analytics/multiple-assets'
    }

    public static LocationExplorer = [this.ROLES.SUPER_ADMIN, this.ROLES.LOCATION_EXPLORER, this.ROLES.LOCATION_EXPLORER_TRIAL]

    public static AlphaFinder = [this.ROLES.SUPER_ADMIN, this.ROLES.ALPHA_FINDER, this.ROLES.ALPHA_FINDER_TRIAL]

    public static PotfolioAnalytics = [this.ROLES.SUPER_ADMIN, this.ROLES.PORTFOLIO_ANALYTICS, this.ROLES.PORTFOLIO_ANALYTICS_TRIAL, this.ROLES.PDF, this.ROLES.SHAREABLE_LINK]

    public static DataManager = [this.ROLES.SUPER_ADMIN, this.ROLES.PORTFOLIO_ANALYTICS, this.ROLES.PORTFOLIO_ANALYTICS_TRIAL, this.ROLES.PDF]

    public static CustomerSupport = Object.values(this.ROLES)

    public static hasAccess(userRoles, allowedRoles): boolean {
        return allowedRoles?.some(role => userRoles?.includes(role));
    }

    public static maximumAccess(userRoles: number[]): number {
        if (typeof userRoles !== 'undefined') {
            return Math.max.apply(Math, userRoles)
        } else return 0
    }

    public static minimumAccess(userRoles: number[]): number {
        return Math.min.apply(Math, userRoles)
    }

    public static isAllowedToPerformAction(admin, allowedRoles) {
        let hasAccess;
        if (admin) {
            const userRoles = admin.roles;
            hasAccess = Role.hasAccess(userRoles, allowedRoles)
        } else {
            hasAccess = allowedRoles.includes(this.ROLES.SHAREABLE_LINK)
        }
        return hasAccess
    }
}

export class AppPermission {
    private static downloadBtnPaths = ['data-manager', 'portfolio-analytics', 'location-explorer'];

    public static get() {
        const admin = JSON.parse(localStorage.getItem("admin"));
        return {
            navbar: {
                downlaodDataIcon: {
                    show: this.downloadBtnPaths.some(path => window.location.pathname.includes(path)),
                    isDataManagerModule: window.location.pathname.includes('data-manager'),
                },
                shareableLinkIncon: {
                    show: window.location.pathname.includes('portfolio-analytics') && Role.hasAccess(admin?.roles, [Role.ROLES.SUPER_ADMIN, Role.ROLES.PORTFOLIO_ANALYTICS, Role.ROLES.PORTFOLIO_ANALYTICS_TRIAL])
                },
                showAPIbutton: admin?.api_access,
                disableDownLoadPdfButton: window.location.pathname.includes('location-explorer') && Role.hasAccess(admin?.roles, [Role.ROLES.LOCATION_EXPLORER_TRIAL]),
                showDownLoadPdfButton: window.location.pathname.includes('portfolio-analytics') || window.location.pathname.includes('location-explorer'),
                showDownLoadAnalysisButton: window.location.pathname.includes('portfolio-analytics')
            },
            PorftolioAnalytics_DataManager: {
                showInfoIcon: window.location.pathname.includes('portfolio-analytics') || window.location.pathname.includes('data-manager'),
                showAddToComparisonBtn: window.location.pathname.includes('portfolio-analytics') && !window.location.pathname.includes('comparison'),
                showSingleAssetMapDropdown: ['/portfolio-analytics/single-asset'].includes(window.location.pathname),
            },
        }
    }

}
export interface RolesType {
    SUPER_ADMIN: number,
    LOCATION_EXPLORER: number,
    LOCATION_EXPLORER_TRIAL: number,
    ALPHA_FINDER: number,
    ALPHA_FINDER_TRIAL: number,
    PDF: number,
    PORTFOLIO_ANALYTICS: number,
    PORTFOLIO_ANALYTICS_TRIAL: number,
    SHAREABLE_LINK: string,
}
