import { menuItem } from "./sidebar.metadata";
import { Role } from "app/shared/data/roles";

const admin = JSON.parse(localStorage.getItem('admin'))

/**
 *  ROLES 
 *  SUPER_ADMIN: 500   -->    can access every thing except  master card interface and subscription
 *  PRO: 300,          -->    Data portal access and scenario forecaster access 
 *  API: 150,          -->    Data portal access only , 
 *  PDF: 110,          -->    can access everything in our application 
 *  BASIC: 100,        -->    Data portal access only
 *  DUMMY: 10,         -->    can access data portal
 *  SHAREABLE_LINK: 'shareble_link'
 */

export const ROUTES: menuItem[] = [
    {
        path: "/alpha-finder/dashboard",
        title: "Alpha Finder",
        icon: "../../../assets/img/svg/alpha-finder.svg",
        class: "has-sub",
        badge: "",
        badgeClass: "badge badge-pill badge-danger float-right mr-1 mt-1",
        isExternalLink: false,
        weightText: "",
        bold: "",
        acl: 500,
        roles: Role.AlphaFinder,
        // hasAccess: Role.isAllowedToPerformAction(admin, Role.AlphaFinder),
        publicLinkPermission: false,
        showBetaIcon: false,
        lockedIconExternalLink: 'https://docs.alphageo.ai/app-guide/alpha-finder',
        submenu: [
            {
                path: "/alpha-finder/dashboard/us",
                title: "USA",
                icon: "../../../assets/img/svg/usa.svg",
                class: "",
                badge: "",
                badgeClass: "badge badge-pill badge-danger float-right mr-1 mt-1",
                isExternalLink: false,
                weightText: "",
                bold: "",
                acl: 500,
                roles: Role.AlphaFinder,
                // hasAccess: Role.isAllowedToPerformAction(admin, Role.AlphaFinder),
                publicLinkPermission: false,
                showBetaIcon: false,
                submenu: [],
            },
            {
                path: "/alpha-finder/dashboard/ca",
                title: "Canada",
                icon: "../../../assets/img/svg/canada.svg",
                class: "",
                badge: "",
                badgeClass: "badge badge-pill badge-danger float-right mr-1 mt-1",
                isExternalLink: false,
                weightText: "",
                bold: "",
                acl: 500,
                roles: Role.AlphaFinder,
                // hasAccess: Role.isAllowedToPerformAction(admin, Role.AlphaFinder),
                publicLinkPermission: false,
                showBetaIcon: false,
                submenu: [],
            },
        ],
    },
    {
        path: "/location-explorer",
        title: "Location Explorer",
        icon: "assets/img/svg/location-analytic/sidebar-icon.svg",
        class: "",
        badge: "",
        badgeClass: "badge badge-pill badge-danger float-right mr-1 mt-1",
        isExternalLink: false,
        weightText: "",
        bold: "",
        acl: 500,
        roles: Role.LocationExplorer,
        publicLinkPermission: false,
        showBetaIcon: false,
        submenu: [],
        lockedIconExternalLink: 'https://docs.alphageo.ai/app-guide/location-explorer',
    },
    {
        path: "/portfolio-analytics/multiple-assets",
        title: "Portfolio Analytics",
        icon: "assets/img/svg/climate-price.svg",
        class: "",
        badge: "",
        badgeClass: "badge badge-pill badge-danger float-right mr-1 mt-1",
        isExternalLink: false,
        weightText: "",
        bold: "",
        acl: 500,
        roles: Role.PotfolioAnalytics,
        // hasAccess: Role.isAllowedToPerformAction(admin, Role.PotfolioAnalytics),
        publicLinkPermission: false,
        showBetaIcon: false,
        submenu: [],
    },
    {
        path: "data-manager/summary",
        title: "Data Manager",
        icon: "assets/img/svg/data-manager.svg",
        class: "",
        badge: "",
        badgeClass: "badge badge-pill badge-danger float-right mr-1 mt-1",
        isExternalLink: false,
        weightText: "",
        bold: "",
        acl: 500,
        roles: Role.DataManager,
        // hasAccess: Role.isAllowedToPerformAction(admin, Role.DataManager),
        publicLinkPermission: false,
        showBetaIcon: false,
        submenu: [
        ],
    }
]

export const Customer_Support: menuItem = {
    path: "https://docs.alphageo.ai/",
    title: "Customer Support Hub",
    icon: "../../../assets/img/svg/Customer Support.svg",
    class: "",
    badge: "",
    badgeClass: "badge badge-pill badge-danger float-right mr-1 mt-1",
    isExternalLink: true,
    weightText: "",
    bold: "",
    acl: 50,
    roles: Role.CustomerSupport,
    // hasAccess: Role.isAllowedToPerformAction(admin, Role.CustomerSupport),
    publicLinkPermission: true,
    showBetaIcon: false,
    submenu: [],
}
