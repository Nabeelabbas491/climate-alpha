import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LocationAnalyticMapComponent } from "./location-analytic-map/location-analytic-map.component";

const routes: Routes = [
    {
        path: '',
        component: LocationAnalyticMapComponent
    },
    {
        path: ':latitude/:longitude/:zoom',
        component: LocationAnalyticMapComponent
    }
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class LocationAnalyticRoutingModule { }