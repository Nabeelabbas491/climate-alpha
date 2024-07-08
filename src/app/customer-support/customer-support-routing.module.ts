import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DisclaimerComponent } from "app/customer-support/diclaimer/disclaimer.component";
import { MethodologyComponent } from "app/customer-support/methodolgy/methodology.component";
import { AppConstants } from "app/shared/data/constants";
import { MainComponent } from "./main/main.component";

const routes: Routes = [
    {
        path: "customer_support",
        pathMatch: "full",
        component: MainComponent,
    },
    {
        path: "main",
        component: MainComponent,
    },
    {
        path: "methodology",
        component: MethodologyComponent,
    },
    {
        path: "disclaimer",
        component: DisclaimerComponent,
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CustomerSupportRoutingModule { }