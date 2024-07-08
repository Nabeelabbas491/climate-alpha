import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AppRoutingModule } from "./app-routing.module";
import { SharedModule } from "./shared/shared.module";
import { ToastrModule } from "ngx-toastr";
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from "@angular/common/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { StoreModule } from "@ngrx/store";
import {
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
} from "ngx-perfect-scrollbar";
import { AppComponent } from "./app.component";
import { ContentLayoutComponent } from "./layouts/content/content-layout.component";
import { FullLayoutComponent } from "./layouts/full/full-layout.component";
import { DragulaService } from "ng2-dragula";
import { AuthService } from "./shared/services/auth.service";
import { AuthGuard } from "./shared/auth/auth-guard.service";
import { ApiService } from "./shared/services/api.service";
import { DownloadService } from "./shared/services/download.service";
import { DownloadPDF } from "./shared/services/download.service";
import { SmoothScrollService } from "./shared/services/smooth-scroll.service";
import { NgxSpinnerModule } from "ngx-spinner";
import { NgCircleProgressModule } from 'ng-circle-progress';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { DownloadChartService, DownloadPDFService } from "./shared/services/download-chart-service";
import { AuthInterceptor } from "./shared/Interceptors/auth.interceptor";
import { environment } from "environments/environment";


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: false,
};

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
@NgModule({
  declarations: [AppComponent, FullLayoutComponent, ContentLayoutComponent],
  imports: [
    BrowserAnimationsModule,
    NgxSpinnerModule,
    StoreModule.forRoot({}),
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgSelectModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    PerfectScrollbarModule,
    NgCircleProgressModule.forRoot({
      "maxPercent": 100,
      "responsive": true,
    }),
  ],
  providers: [
    AuthService,
    AuthGuard,
    DragulaService,
    ApiService,
    DownloadService,
    DownloadPDF,
    SmoothScrollService,
    DownloadChartService,
    DownloadPDFService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {
  // paymentHandler:any = null;

  // constructor() { }

  // ngOnInit() {
  //   this.invokeStripe();
  // }

  // makePayment(amount) {
  //   const paymentHandler = (<any>window).StripeCheckout.configure({
  //     key: 'your key',
  //     locale: 'auto',
  //     token: function (stripeToken: any) {
  //       console.log(stripeToken)
  //       alert('Stripe token generated!');
  //     }
  //   });

  //   paymentHandler.open({
  //     name: 'MeaningArticles',
  //     description: '3 widgets',
  //     amount: amount * 100
  //   });
  // }

  // invokeStripe() {
  //   if(!window.document.getElementById('stripe-script')) {
  //     const script = window.document.createElement("script");
  //     script.id = "stripe-script";
  //     script.type = "text/javascript";
  //     script.src = "https://js.stripe.com/v3/";
  //     script.onload = () => {
  //       this.paymentHandler = (<any>window).Stripe.configure({
  //         key: 'pk_test_51Lkg5vCdjYurknMa9HtoGjp6aMug0IVK7zjGy4c46HnxvdFslYfvoZ0HfPnnjnl8qtMjGGRpHvnMHMGT7ZxnX4S300HUTRx25K',
  //         locale: 'auto',
  //         token: function (stripeToken: any) {
  //           console.log(stripeToken)
  //           alert('Payment has been successfull!');
  //         }
  //       });
  //     }

  //     window.document.body.appendChild(script);
  //   }
  // }
}

