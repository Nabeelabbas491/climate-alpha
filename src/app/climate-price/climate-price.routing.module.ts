import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SinglePropertyComponent } from "./single-property/single-property/single-property.component";
import { MultiplePropertiesComponent } from "./multiple-properties/multiple-properties/multiple-properties.component";
import { SummaryComponent } from "./summary/summary.component";
import { ComparisonComponent } from "./comparison/comparison.component";

const routes: Routes = [
    {
        path: 'single-asset',
        component: SinglePropertyComponent
    },
    {
        path: 'single-asset/:propertyId',
        component: SinglePropertyComponent
    },
    {
        path: 'multiple-assets',
        component: MultiplePropertiesComponent
    },
    {
        path: 'comparison',
        component: ComparisonComponent
    },
    {
        path: 'overview',
        component: SummaryComponent
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule],
})
export class ClimatePriceRoutingModule { }