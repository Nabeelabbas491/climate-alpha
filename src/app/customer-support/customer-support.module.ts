import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { CustomerSupportRoutingModule } from './customer-support-routing.module';
// import { MethodologyComponent } from 'app/customer-support/methodolgy/methodology.component';
import { DisclaimerComponent } from './diclaimer/disclaimer.component';
import { MethodologyComponent } from './methodolgy/methodology.component';
// import { MethodologyComponent } from 'app/methodology/main/methodology.component';
// import { DisclaimerComponent } from 'app/customer-support/diclaimer/disclaimer.component';



@NgModule({
  declarations: [
    MainComponent, MethodologyComponent, DisclaimerComponent
  ],
  imports: [
    CommonModule,
    CustomerSupportRoutingModule
  ],
  exports: [
    DisclaimerComponent,
    MethodologyComponent
  ]

})
export class CustomerSupportModule { }
