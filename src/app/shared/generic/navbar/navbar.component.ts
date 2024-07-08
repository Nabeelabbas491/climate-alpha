import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { AppConstants } from "../../data/constants";
@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {

  publicLink: boolean = false;

  constructor(public _authService: AuthService, private _cdr: ChangeDetectorRef) { }

  ngOnInit() {
    window.location.search.includes(AppConstants.Public_Link_Key) ? this.publicLink = this._authService.isPublicLink() : this.checkUserAuthorization()
    this._cdr.detectChanges()
  }

  // checking user permissions and then showing items list in sidebar based of different users
  checkUserAuthorization() {
    // this.user = this.authService.admin;
    // this.isBaseline = this.user['is_baseline'];
    // switch (Role.maximumAccess(this.user.roles)) {
    //   // dummy account
    //   case 10:
    //     this.showNavBarItems = false
    //     this.isDummyUser = true;
    //     break;
    //   case 100:
    //     this.showNavBarItems = false
    //     break;
    //   case 500:
    //     this.showAdminButtons = true;
    //     break;
    //   default:
    //   // default case here
    // }
  }
}