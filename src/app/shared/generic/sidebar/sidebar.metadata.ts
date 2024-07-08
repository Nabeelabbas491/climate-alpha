// Sidebar route metadata
export interface RouteInfo {
  sectionTitle: string
  lineBreak: Boolean,
  menuItems: menuItem[];
  // path?: string;
  // title?: string;
  // icon?: string;
  // class?: string;
  // badge?: string;
  // badgeClass?: string;
  // isExternalLink?: boolean;
  // weightText?: string;
  // bold?: string;
  // submenu?: RouteInfo[];
  // breakLine?: boolean,
  // sectionLabel?: string
  // acl?: number
}

export interface menuItem {
  path?: string;
  title?: string;
  icon?: string;
  class?: string;
  badge?: string;
  badgeClass?: string;
  isExternalLink?: boolean;
  weightText?: string;
  bold?: string;
  submenu?: menuItem[];
  acl?: number,
  roles: any,
  hasAccess?: boolean
  publicLinkPermission?: boolean
  showBetaIcon: boolean,
  lockedIconExternalLink?: string
}


