import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class AppService {

  public closedSideBarObs$ = new BehaviorSubject<any>(undefined);
  public shareableLinkExpiry$ = new BehaviorSubject<any>(undefined);
  public filters;

  constructor(private api: ApiService, private auth: AuthService) { }

  // onScroll, setSlidingHeader and setAppHeader ( These three methods control full flow of sliding header)
  onScroll() {
    /**
     *  Using in Portfolio Analytics, Location Analytics and Data-Manager
     */
    // Show/hide the headers per user scroll direction
    const navbar = document.getElementById("app-header")
    const porftolioAnalyticsHeader = document.getElementById("sliding-header");
    const navbarItems = document.getElementById("navbarItems")
    var sticky = porftolioAnalyticsHeader?.offsetTop;
    if (navbar && porftolioAnalyticsHeader && navbarItems) {
      if (window.pageYOffset > sticky) {
        // on scrolling towards bottom 
        navbarItems.style.transition = 'all 0.1s ease'
        if (porftolioAnalyticsHeader.offsetTop == 0) {
          navbarItems.style.visibility = 'visible'
        }
        navbarItems.style.paddingTop = '11px'
        navbarItems.style.top = '0px'
        navbar.style.visibility = 'hidden'
        porftolioAnalyticsHeader.style.top = "0px"
        porftolioAnalyticsHeader.style.paddingTop = '20px'
      } else {
        // when scrolled to top 
        navbarItems.style.visibility = 'hidden'
        navbarItems.style.paddingTop = '0px'
        navbarItems.style.top = '-40px'
        navbar.style.visibility = 'visible'
        porftolioAnalyticsHeader.style.top = "60px"
        porftolioAnalyticsHeader.style.paddingTop = 'unset'
      }
    }
  }

  setSlidingHeader() {
    setTimeout(() => {
      const isSidebarExpanded = document.getElementsByClassName('hide_sidebar').length
      if (isSidebarExpanded) {
        document.getElementById('sliding-header').classList.add('extra_margin')
      } else {
        document.getElementById('sliding-header').classList.remove('extra_margin')
      }
    })
  }

  setAppHeader() {
    const element = document.getElementById("app-header")
    if (element) {
      element.style.visibility = 'visible'
    }
  }
}
