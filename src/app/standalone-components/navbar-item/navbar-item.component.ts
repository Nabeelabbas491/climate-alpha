import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdown, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AppConstants } from 'app/shared/data/constants';
import { AppPermission, Role } from 'app/shared/data/roles';
import { ApiService } from 'app/shared/services/api.service';
import { AuthService } from 'app/shared/services/auth.service';
import { ConfigService } from 'app/shared/services/config.service';
import { DownloadChartService } from 'app/shared/services/download-chart-service';
import { LayoutService } from 'app/shared/services/layout.service';
import { ToastRef, ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { AppService } from 'app/shared/services/app.service';
import { FileConstant } from 'app/shared/data/file';
import { filter } from 'rxjs/operators';
import { ShareableLinkComponent } from './shareable-link/shareable-link.component';
import { DownloadPdfComponent } from '../download-pdf/download-pdf.component';
import { ClimateAlphaService } from 'app/shared/services/climatealpha.service';
import { environment } from "../../../environments/environment";

@Component({
  selector: 'app-navbar-item',
  standalone: true,
  imports: [CommonModule, NgbModule, RouterModule, FormsModule, NgSelectModule, ShareableLinkComponent, DownloadPdfComponent],
  templateUrl: './navbar-item.component.html',
  styleUrls: ['./navbar-item.component.scss']
})
export class NavbarItemComponent implements OnInit {

  @ViewChild('stickyMenu') menuElement: ElementRef;
  @ViewChild(ToastRef) taostrRef: any
  @ViewChildren(NgbDropdown) ngbDropdownRefs: NgbDropdown
  @ViewChild(ShareableLinkComponent) sharabeLinkComponent: ShareableLinkComponent
  @Output() toggleHideSidebar = new EventEmitter<Object>();
  subscription$: Subscription = new Subscription()

  placement = "bottom-right";
  elementPosition: any;
  layoutSub: Subscription;
  user: any;
  publicLink = false;
  curtomerDataPortalIcon = '../../../assets/img/svg/vector.svg'
  apiDocsURL = AppConstants.API_DOCS_URL;
  apiDocumentation = AppConstants.API_DOCUMENTATION
  public config: any = {};
  apiToken;
  ngbDropdowns = {
    'share': false,
    'user': false,
    'api': false,
    'analysis': false
  }
  pdfFilters;
  // use this syntax onward to show navbar items based on authorization or different modules
  permissions = AppPermission.get().navbar;

  disableButtonsMsg = AppConstants.PA_DOWNLOAD_BUTTONS_MSG

  constructor(
    private _apiService: ApiService,
    private _router: Router,
    public translate: TranslateService,
    private layoutService: LayoutService,
    private configService: ConfigService,
    private apiService: ApiService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    public authService: AuthService,
    public _appService: AppService,
    public _climatealphaService: ClimateAlphaService,
    private downloadChart: DownloadChartService,
  ) {
    this.apiDocumentation = environment.API_DOCS_URL;
    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|es|pt|de/) ? browserLang : "en");

    this.layoutSub = layoutService.changeEmitted$.subscribe((direction) => {
      const dir = direction.direction;
      if (dir === "rtl") {
        this.placement = "bottom-left";
      } else if (dir === "ltr") {
        this.placement = "bottom-right";
      }
    });
  }

  ngOnInit() {
    this.user = this.authService.admin;
    this.config = this.configService.templateConf;
    if (window.location.search.includes(AppConstants.Public_Link_Key)) this.publicLink = this.authService.isPublicLink()
    this._router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event) => { if (event) this.permissions = AppPermission.get().navbar })
    this.setPdfReportInputs()
  }

  setPdfReportInputs() {
    this.subscription$.add(this._climatealphaService.pdfReportFilters$.subscribe((response) => {
      this.pdfFilters = response
    }))
  }

  ngAfterViewInit() {
    this.elementPosition = this.menuElement?.nativeElement.offsetTop;
    if (this.config.layout.dir) {
      setTimeout(() => {
        const dir = this.config.layout.dir;
        if (dir === "rtl") {
          this.placement = "bottom-left";
        } else if (dir === "ltr") {
          this.placement = "bottom-right";
        }
      }, 0);
    }
  }


  logout() {
    this.apiService.get("auth/logout").subscribe(
      (response) => {
        this.authService.logout(null);
      },
      (error) => {
        error.status === 401 ? this.authService.logout() : "";
        let error_message = error.error.message;
        this.toastr.error(error_message, "Error");
      }
    );
  }

  // modal 
  async openModal(content) {
    try {
      // this.text = "Copy"
      let response = await this.getAPIAccessToken()
      this.apiToken = response['payload'].access_token
      this.modalService.open(content, {
        size: 'lg',
        windowClass: 'fixed_modal_height',
        scrollable: true,
        backdropClass: "fixed_modal_height",
        backdrop: true,
      }).result.then((result) => {

      }, (reason) => {
      });
    } catch (e) { }
  }

  async getAPIAccessToken() {
    var url = 'auth/api_access_token/';
    return new Promise((resolve, reject) => {
      this._apiService.get(url).subscribe(
        (response) => {
          resolve(response)
        },
        (error) => {
          resolve(error.error)
        }
      );
    });
  }

  openChangeMenu(event, item) {
    this.ngbDropdowns[item] = event
  }

  async refreshToken() {
    let response = await this.getRefreshToken()
    this.apiToken = response['payload'].access_token
    this.toastr.success("Token Refreshed!")
  }

  getRefreshToken() {
    var url = 'auth/api_access_token/refresh/';
    return new Promise((resolve, reject) => {
      this._apiService.get(url).subscribe(
        (response) => {
          resolve(response)
        },
        (error) => {
          resolve(error.error)
        }
      );
    });
  }

  copyToClipboard(text) {
    navigator.clipboard.writeText(this.apiToken)
    this.toastr.success("Token Copied!")
  }


  async downloadFile(endPoint, module) {
    try {
      let response, body, fileType = Object.keys(FileConstant.fileTypeOptions)[1];
      this.toastr.success('Your download request is in progress. Please wait.')
      switch (module) {
        case 'Portfolio-Analytics':
          body = { end_point: endPoint, filters: {} }
          response = await this.downloadChart.getCSVDownload(body, fileType);
          break;
        case 'Data-manager':
          body = { end_point: endPoint, filters: this._appService.filters }
          response = await this.downloadChart.postCSVDownlaod(body)
          break;
      }
      FileConstant.saveFile({ response: response, fileType: fileType })
      this.toastr.success('Your file has been downloaded successfully.')
    } catch (e) {
      const conatctLabel = 'Contact Support'
      this.toastr.error(
        `<div>Oops! Something went wrong while downloading your data.</div>
        <span class="toastr-data-download-error"> ${conatctLabel} </span>`,
        '', {
        disableTimeOut: true,
        enableHtml: true,
        closeButton: true,
      }).onShown.subscribe(() => {
        document.getElementById('toast-container').addEventListener('click', (event) => {
          if (event.target['innerHTML'].includes(conatctLabel)) {
            const subject = 'Data Download Error', sendTo = 'support@alphageo.ai';
            AppConstants.openGmailPopup({ subject, sendTo })
          }
        })
      })
    }
  }

  ngOnDestroy() {
    if (this.layoutSub) {
      this.layoutSub.unsubscribe();
    }
    this.subscription$.unsubscribe()
  }

}


export interface PublicLink {
  access_token: string
  created_at: string
  is_active: boolean
  owner: number
  shared_emails: Array<string>
  updated_at: string
  url: string
  uuid: string
  views: number
}
