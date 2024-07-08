
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Role } from "app/shared/data/roles";
import { RolesGuard } from "app/shared/auth/roles.guard";
import { DataManagerSummaryComponent } from "./data-manager-summary/data-manager-summary.component";
import { DataManagerAssetsComponent } from "./data-manager-assets/data-manager-assets.component";

const routes: Routes = [
    {
        path: 'summary',
        canActivate: [RolesGuard],
        component: DataManagerSummaryComponent,
        data: {
            roles: Role.DataManager
        }
    },
    {
        path: 'assets',
        canActivate: [RolesGuard],
        component: DataManagerAssetsComponent,
        data: {
            roles: Role.DataManager
        }
    },
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule],
})
export class DataManagerRoutingModule { }