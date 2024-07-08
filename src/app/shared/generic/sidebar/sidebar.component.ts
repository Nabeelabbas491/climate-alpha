import {
    Component,
    OnInit,
    ViewChild,
    OnDestroy,
    ElementRef,
    Renderer2,
    AfterViewInit,
    ViewEncapsulation,
} from "@angular/core";
import { Customer_Support, ROUTES } from "./sidebar-routes.config";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { customAnimations } from "../../data/animations/custom-animations";
import { ConfigService } from "../../services/config.service";
import { LayoutService } from "../../services/layout.service";
import { Subscription } from "rxjs";
import { AppConstants } from "app/shared/data/constants";
import { SmoothScrollService } from "../../services/smooth-scroll.service";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import * as cloneDeep from "lodash/cloneDeep";
import { Role } from "app/shared/data/roles";
import { ClimateAlphaService } from "app/shared/services/climatealpha.service";
import { AuthService } from "app/shared/services/auth.service";

@Component({
    selector: "app-sidebar",
    templateUrl: "./sidebar.component.html",
    styleUrls: ["./sidebar.component.scss"],
    animations: customAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class SidebarComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild("toggleIcon") toggleIcon: ElementRef;
    public menu: any[] = ROUTES;
    depth: number;
    activeTitle: string;
    activeTitles: string[] = [];
    expanded: boolean;
    nav_collapsed_open = false;
    logoUrl = AppConstants.SIDEBAR_LOGO;
    user = Object.assign({});
    dataUploadIcon = "../../../assets/img/svg/upload.svg"
    // toggledLogo = AppConstants.TOGGLED_LOGO;
    lastPath: string = "";
    closeResult;
    public config: any = {};
    layoutSub: Subscription;
    customer_support = Customer_Support
    subscription$: Subscription;
    count: any;
    dataToggle: string;  // collapsed and expnaded value. 
    sidebarChip: string;

    constructor(
        private renderer: Renderer2,
        private router: Router,
        public translate: TranslateService,
        private configService: ConfigService,
        private layoutService: LayoutService,
        private smoothScrollService: SmoothScrollService,
        private modalService: NgbModal,
        private _climateAlphaService: ClimateAlphaService,
        private _authService: AuthService
    ) {
        this.sidebarChip = this._authService.isTrialUser() && 'assets/img/svg/sidebar/trial.svg'
        this.getUser()
        this.customizeSource()
        this.subscription$ = new Subscription();
        this.menu = this.menu.map((m, idx) => { return { ...m, order: idx + 1 } })
    }

    ngOnInit() {
        this.config = this.configService.templateConf;
        this.setItemActiveInSidebar()
    }

    ngAfterViewInit() {
        setTimeout(() => {
            if (this.config.layout.sidebar.collapsed != undefined) {
                if (this.config.layout.sidebar.collapsed === true) {
                    this.expanded = false;
                    this.renderer.addClass(
                        this.toggleIcon.nativeElement,
                        "ft-toggle-left"
                    );
                    this.renderer.removeClass(
                        this.toggleIcon.nativeElement,
                        "ft-toggle-right"
                    );
                    // making it false to fix the sidebar menu opening issue for forecasters.
                    this.nav_collapsed_open = false;
                } else if (this.config.layout.sidebar.collapsed === false) {
                    this.expanded = true;
                    this.renderer.removeClass(
                        this.toggleIcon.nativeElement,
                        "ft-toggle-left"
                    );
                    this.renderer.addClass(
                        this.toggleIcon.nativeElement,
                        "ft-toggle-right"
                    );
                    this.nav_collapsed_open = false;
                }
            }
        }, 0);
        // putting unclocked items on first and locked items after in sidebar list
        if (this.menu.findIndex(m => !m.hasAccess) > -1) {
            this.menu = this.menu.sort((a, b) => a.hasAccess > b.hasAccess ? -1 : 1)
        } else {
            this.menu = this.menu.sort((a, b) => (a.order > b.order ? 1 : -1));
        }
    }

    ngOnDestroy() {
        if (this.layoutSub) {
            this.layoutSub.unsubscribe();
        }
        this.subscription$?.unsubscribe();
    }

    getUser() {
        if (localStorage.getItem("admin")) {
            this.user = JSON.parse(localStorage.getItem("admin"));
        } else if (localStorage.getItem('public-token')) {
            const sharebleLinkType = Role.ROLES.SHAREABLE_LINK
            this.user.acl = sharebleLinkType
            this.user.roles = [sharebleLinkType]
            this.menu = cloneDeep(ROUTES);
        }
    }

    userHasAccess(allowed_roles: number[]): boolean {
        return allowed_roles ? Role.hasAccess(this.user.roles, allowed_roles) : false;
    }

    userHasMinimumAccess(allowed_role: number) {
        return allowed_role ? Role.maximumAccess(this.user.roles) >= allowed_role : false;
    }

    customizeSource() {
        if (this.depth === undefined) {
            this.depth = 0;
            this.expanded = true;
        }
        this.layoutSub = this.layoutService.customizerChangeEmitted$.subscribe(
            (options) => {
                if (options) {
                    if (options.compactMenu === true) {
                        this.expanded = false;
                        this.renderer.addClass(
                            this.toggleIcon.nativeElement,
                            "ft-toggle-left"
                        );
                        this.renderer.removeClass(
                            this.toggleIcon.nativeElement,
                            "ft-toggle-right"
                        );
                        this.nav_collapsed_open = true;
                    } else if (options.compactMenu === false) {
                        this.expanded = true;
                        this.renderer.removeClass(
                            this.toggleIcon.nativeElement,
                            "ft-toggle-left"
                        );
                        this.renderer.addClass(
                            this.toggleIcon.nativeElement,
                            "ft-toggle-right"
                        );
                        this.nav_collapsed_open = false;
                    }
                }
            }
        );
    }

    checkClass(elem, cls) {
        if (elem.classList.contains(cls)) {
            if (elem.classList.contains('has-sub')) {
                return null;
            }
            return elem;
        }
        else return this.checkClass(elem.parentElement, cls)
    }

    scroll(route, subItemTitle, hasSubClass, path = '') {
        event.stopPropagation();
        var li = event.srcElement as HTMLElement;
        var main_nav = this.checkClass(li, 'navigation');
        for (var i = 0; i < main_nav.children.length; i++) {
            if (main_nav.children[i].classList.contains('has-sub')) {
                var ul = main_nav.children[i].children[1];
                for (var j = 0; j < ul.children.length; j++) {
                    var _li = ul.children[j];
                    if (_li.classList.contains('child')) {
                        if (_li.classList.contains('has-sub')) {
                            for (var y = 0; y < _li.children[1].children.length; y++) {
                                this.renderer.removeClass(_li.children[1].children[y], 'active')
                            }
                        } else this.renderer.removeClass(_li, 'active')
                    }
                }
            }
        }

        var elem = this.checkClass(li, 'child');
        if (elem) {
            this.renderer.addClass(elem, 'active');
            // this.setItemActiveInSidebar(path)
        }
        else if (!li.parentElement.parentElement.classList.contains('has-sub')) {
            this.renderer.addClass(li.parentElement.parentElement, 'active');
        }
        if (
            hasSubClass !== "has-sub" ||
            subItemTitle === "Risks" ||
            subItemTitle === "Projections" ||
            subItemTitle === "Current" ||
            subItemTitle === "Government Expenditure" ||
            subItemTitle === "Transport Infrastructure" ||
            subItemTitle === "Demographics" ||
            subItemTitle === "Health" ||
            subItemTitle === "Education" ||
            subItemTitle === "Public Welfare" ||
            subItemTitle === "Crime" ||
            subItemTitle === "Fiscal" ||
            subItemTitle === "Economic Opportunity" ||
            subItemTitle === "Investment Climate" ||
            subItemTitle === "Standard of Living" ||
            subItemTitle === "Public Works" ||
            subItemTitle === "Housing and Construction" ||
            subItemTitle === "Residential" ||
            subItemTitle === "Commercial" ||
            subItemTitle === "Agriculture" ||
            subItemTitle === "Price trends by asset type" ||
            subItemTitle === "County Forecaster" ||
            subItemTitle === "Resilience Index" ||
            subItemTitle === "Risk Index" ||
            subItemTitle === "Vulnerability Index" ||
            subItemTitle === "Readiness Index" ||
            subItemTitle === "State Forecaster" ||
            subItemTitle === "Civic Services" || subItemTitle == "Data Manager" || subItemTitle == "Data Upload" || subItemTitle == 'Single Property Analysis' ||
            subItemTitle == 'Portfolio Overview' || subItemTitle == 'Summary Analysis' ||
            subItemTitle == 'Customer Support Hub' ||
            subItemTitle == 'Methodology' ||
            subItemTitle == 'Disclaimer' ||
            subItemTitle == 'Contact Us'
        )
            if (
                subItemTitle === "Overview" ||
                subItemTitle === "Risks" ||
                subItemTitle === "Projections" ||
                subItemTitle === "Current" ||
                subItemTitle === "Government Expenditure" ||
                subItemTitle === "Transport Infrastructure" ||
                subItemTitle === "Demographics" ||
                subItemTitle === "Health" ||
                subItemTitle === "Education" ||
                subItemTitle === "Public Welfare" ||
                subItemTitle === "Crime" ||
                subItemTitle === "Fiscal" ||
                subItemTitle === "Economic Opportunity" ||
                subItemTitle === "Investment Climate" ||
                subItemTitle === "Standard of Living" ||
                subItemTitle === "Public Works" ||
                subItemTitle === "Housing and Construction" ||
                subItemTitle === "Residential" ||
                subItemTitle === "Commercial" ||
                subItemTitle === "Agriculture" ||
                subItemTitle === "Price trends by asset type" ||
                subItemTitle === "County Forecaster" ||
                subItemTitle === "Resilience Index" ||
                subItemTitle === "Risk Index" ||
                subItemTitle === "Vulnerability Index" ||
                subItemTitle === "Readiness Index" ||
                subItemTitle === "State Forecaster" ||
                subItemTitle === "Civic Services" || subItemTitle == "Data Manager" || subItemTitle == "Data Upload" || subItemTitle == 'Single Property Analysis' ||
                subItemTitle == 'Portfolio Overview' || subItemTitle == 'Summary Analysis' ||
                subItemTitle == 'Customer Support Hub' ||
                subItemTitle == 'Methodology' ||
                subItemTitle == 'Disclaimer' ||
                subItemTitle == 'Contact Us' || subItemTitle == 'USA' || subItemTitle == 'Canada'

            ) {
                // let split_path = path.split('/');
                // this.router.navigate([`/${split_path[1]}`, split_path[2]]);
                this.router.navigate([path])
            }
            else this.smoothScrollService.setSection(subItemTitle);
    }

    toggleSlideInOut(menuItem) {
        if (menuItem.hasAccess) {
            if (menuItem.class !== "has-sub") {
                this.lastPath = menuItem.path;
                this.router.navigate([`${menuItem.path}`]);
                return;
            }
            if (this.lastPath !== menuItem.path) {
                this.lastPath = menuItem.path;
                try {
                    let index = menuItem.submenu.findIndex(el => el.acl <= Role.maximumAccess(this.user.roles))
                    this.router.navigate([menuItem.submenu[index].path]);
                }
                catch (error) {
                    return;
                }
                return;
            }
            this.expanded = !this.expanded;
        }
    }

    handleToggle(titles) {
        this.activeTitles = titles;
    }

    // NGX Wizard - skip url change
    ngxWizardFunction(path: string) {
        if (path.indexOf("forms/ngx") !== -1)
            this.router.navigate(["forms/ngx/wizard"], { skipLocationChange: false });
    }

    // Open default modal
    open(content) {
        this.modalService
            .open(content, {
                centered: true,
                windowClass: "dark-modal",
                backdropClass: "light-white-backdrop",
                size: "lg",
            })
            .result.then(
                (result) => {
                    this.closeResult = `Closed with: ${result}`;
                },
                (reason) => {
                    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
                }
            );
    }

    // This function is used in open
    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return "by pressing ESC";
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return "by clicking on a backdrop";
        } else {
            return `with: ${reason}`;
        }
    }

    setItemActiveInSidebar() {
        this.subscription$.add(
            this._climateAlphaService.activeSiderBarItem$.subscribe((response) => {
                if (response) {
                    let pathname = response
                    const list = document.getElementsByClassName("child")
                    for (let i = 0; i < list.length; i++) {
                        const nodeId = list[i].getAttribute("id")
                        if (pathname == nodeId) {
                            var li = list[i] as HTMLElement
                            var main_nav = this.checkClass(li, 'navigation');
                            for (let i = 0; i < main_nav.children.length; i++) {
                                if (main_nav.children[i].classList.contains('has-sub')) {
                                    var ul = main_nav.children[i].children[1];
                                    for (var j = 0; j < ul.children.length; j++) {
                                        var _li = ul.children[j];
                                        if (_li.classList.contains('child')) {
                                            if (_li.classList.contains('has-sub')) {
                                                for (var y = 0; y < _li.children[1].children.length; y++) {
                                                    this.renderer.removeClass(_li.children[1].children[y], 'active')
                                                }
                                            } else this.renderer.removeClass(_li, 'active')
                                        }
                                    }
                                }
                            }
                            var elem = this.checkClass(li, 'child');
                            if (elem) {
                                this.renderer.addClass(elem, 'active');
                            }
                            else if (!li.parentElement.parentElement.classList.contains('has-sub')) {
                                this.renderer.addClass(li.parentElement.parentElement, 'active');
                            }
                        }
                    }
                }
            })
        )

    }

    navigateToExternalLink(externalLink) {
        externalLink && window.open(externalLink, '_blank');
    }

}
