import { Routes } from "@angular/router";
import { RolesGuard } from "../auth/roles.guard";
import { Role } from "../data/roles";

//Route for content layout with sidebar, navbar and footer.
export const Full_ROUTES: Routes = [
  {
    path: "alpha-finder",
    canActivate: [RolesGuard],
    data: {
      roles: Role.AlphaFinder
    },
    loadChildren: () =>
      import("../../alpha-finder/alpha-finder.module").then(
        (m) => m.AlphaFinderModule
      ),
  },
  {
    path: "portfolio-analytics",
    data: {
      roles: Role.PotfolioAnalytics,

    },
    canActivate: [RolesGuard],
    loadChildren: () =>
      import("../../climate-price/climate-price.module").then(
        (m) => m.ClimatePriceModule
      ),
  },
  {
    path: 'data-manager',
    canActivate: [RolesGuard],
    data: {
      roles: Role.DataManager
    },
    loadChildren: () =>
      import("../../data-manager/data-manager.module").then(
        (m) => m.DataManagerModule
      ),
  },
  {
    path: "location-explorer",
    canActivate: [RolesGuard],
    data: {
      roles: Role.LocationExplorer
    },
    loadChildren: () =>
      import("../../location-analytic/location-analytic.module").then(
        (m) => m.LocationAnalyticModule
      ),
  },
];
