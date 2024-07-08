import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppConstants } from "app/shared/data/constants";
import { AlphaFinderMainComponent } from "./alpha-finder-main/alpha-finder-main.component";
import { AlphaRankingMainComponent } from "./alpha-ranking-main/alpha-ranking-main.component";
import { SaveSelectedFeatureSearchComponent } from "./save-selected-feature-search/save-selected-feature-search.component";
import { UserSavedSearchesComponent } from "./user-saved-searches/user-saved-searches.component";
import { AlphaFinderConstants } from "./alpha-finder.constants";
import { AlphaSearchCanadaComponent } from "./alpha-ranking-main/alpha-search-canada/alpha-search-canada.component";

const routes: Routes = [
    {
        path: "dashboard",
        redirectTo: 'dashboard/us',
        pathMatch: 'full'
    },
    {
        path: "dashboard/us",
        component: AlphaFinderMainComponent,
        data: {
            country: AlphaFinderConstants.countries['us'],
        }
    },
    {
        path: "dashboard/ca",
        component: AlphaFinderMainComponent,
        data: {
            country: AlphaFinderConstants.countries['ca'],
        }
    },
    {
        path: "save-search/:country",
        component: SaveSelectedFeatureSearchComponent,
        data: {
        }
    },
    {
        path: "load-search/:country",
        component: UserSavedSearchesComponent,
        data: {
        }
    },
    {
        path: "alpha-search/us",
        component: AlphaRankingMainComponent,
        data: {
            country: AlphaFinderConstants.countries['us'],
        }
    },
    {
        path: "alpha-search/ca",
        component: AlphaSearchCanadaComponent,
        data: {
            country: AlphaFinderConstants.countries['ca'],
        }
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AlphaFinderRoutingModule { }