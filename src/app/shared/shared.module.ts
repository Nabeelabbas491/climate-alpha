import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { NgxSpinnerModule } from 'ngx-spinner';
//COMPONENTS
import { FooterComponent } from "./generic/footer/footer.component";
import { NavbarComponent } from "./generic/navbar/navbar.component";
import { SidebarComponent } from "./generic/sidebar/sidebar.component";
import { FormsModule } from '@angular/forms';
//DIRECTIVES
import { SidebarDirective } from "./directives/sidebar.directive";
import { SidebarLinkDirective } from "./directives/sidebarlink.directive"
import { SidebarListDirective } from "./directives/sidebarlist.directive";
import { SidebarAnchorToggleDirective } from "./directives/sidebaranchortoggle.directive";
import { SidebarToggleDirective } from "./directives/sidebartoggle.directive";
import { SubHeadingComponent } from "./generic/sub-heading/sub-heading.component";
import { DownloadChartComponent } from "./generic/download-chart/download-chart.component";
import { RankingBarsComponent } from './generic/ranking-bars/ranking-bars.component';
import { RoleDirective } from './directives/role..directive';
import { NgCircleProgressModule } from "ng-circle-progress";
import { NavbarItemComponent } from "app/standalone-components/navbar-item/navbar-item.component";
@NgModule({
  exports: [
    CommonModule,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    SidebarDirective,
    NgbModule,
    TranslateModule,
    SubHeadingComponent,
    DownloadChartComponent,
    NgxSpinnerModule,
    RankingBarsComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    NgbModule,
    TranslateModule,
    PerfectScrollbarModule,
    NgxSpinnerModule,
    FormsModule,
    NavbarItemComponent,
    NgCircleProgressModule.forRoot({
      "maxPercent": 100,
      "responsive": true,
    })
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    SidebarDirective,
    SidebarLinkDirective,
    SidebarListDirective,
    SidebarAnchorToggleDirective,
    SidebarToggleDirective,
    SubHeadingComponent,
    DownloadChartComponent,
    RankingBarsComponent,
    RoleDirective,
  ],
  providers: [
  ],
})
export class SharedModule { }
