import {
  Directive,
  HostListener,
  Input,
  Inject,
  HostBinding,
  Output,
  EventEmitter,
  OnInit,
  ElementRef
} from "@angular/core";
import { SidebarListDirective } from "./sidebarlist.directive";
import { SidebarDirective } from "./sidebar.directive";
import { AuthService } from "../services/auth.service";
import { Role } from "../data/roles";

@Directive({ selector: "[appSidebarlink]" })
export class SidebarLinkDirective implements OnInit {
  @Input()
  public level: number;

  @Input()
  public classes: string;

  @Input()
  public parent: string;

  @Input()
  public title: string;

  @Input()
  public routePath: string;

  @Input()
  public allowedRoles: Array<number | string>;

  @Output()
  toggleEmit = new EventEmitter();

  @Output()
  hasAccessEmit = new EventEmitter();

  @HostBinding("class.open")
  @Input()
  get open(): boolean {
    return this._open;
  }
  set open(value: boolean) {
    this._open = value;
  }

  @HostBinding("class.nav-collapsed-open")
  @Input()
  get navCollapsedOpen(): boolean {
    return this._navCollapsedOpen;
  }
  set navCollapsedOpen(value: boolean) {
    this._navCollapsedOpen = value;
  }

  @HostBinding("class.active")
  @Input()
  get active(): boolean {
    return this._active;
  }
  set active(value: boolean) {
    this._active = value;
  }

  @HostBinding("class.is-shown")
  @Input()
  get isShown(): boolean {
    return this._isShown;
  }
  set isShown(value: boolean) {
    this._isShown = value;
  }

  @HostBinding("class.is-hidden")
  @Input()
  get isHidden(): boolean {
    return this._isHidden;
  }
  set isHidden(value: boolean) {
    this._isHidden = value;
  }
  protected _open: boolean;
  protected _navCollapsedOpen: boolean;
  protected _active: boolean;
  protected _isShown: boolean;
  protected _isHidden: boolean;
  protected sidebarList: SidebarListDirective;
  protected sidebar: SidebarDirective;
  protected hasAccess: boolean;

  constructor(
    @Inject(SidebarListDirective) sidebarList: SidebarListDirective,
    @Inject(SidebarDirective) sidebar: SidebarDirective,
    private el: ElementRef,
    private _authService: AuthService
  ) {
    this.sidebarList = sidebarList;
    this.sidebar = sidebar;
    // 
  }

  ngOnInit(): any {
    this.sidebar.addLink(this);
    this.hasAccess = Role.isAllowedToPerformAction(this._authService.admin, this.allowedRoles)
    this.hasAccess ? '' : (this.el.nativeElement as HTMLElement).style.opacity = '0.4'
    this.hasAccessEmit.next(this.hasAccess)
  }

  toggle(): any {
    if (this.hasAccess) {
      this.sidebarList.activeLinks = [];
      this.sidebarList.setList(this.sidebar.getLinks());

      const classList = this.el.nativeElement.classList;

      if (this.level.toString().trim() === "3") {
        this.active = true;
        this.sidebarList.toggleActiveList(this);
        this.sidebar.hideSidebar();
      }

      if (this.level.toString().trim() === "1" && !classList.contains("has-sub")) {
        this.sidebarList.collapseOtherLinks(this);
      }


      if (classList.contains("has-sub") && classList.contains("open")) {
        this.sidebarList.collapse(this);
      } else {
        if (classList.contains("has-sub")) {
          this.sidebarList.expand(this);
        }
      }
    }

  }
}
