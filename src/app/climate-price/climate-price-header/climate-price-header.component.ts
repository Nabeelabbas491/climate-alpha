import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AppService } from 'app/shared/services/app.service';
import { AuthService } from 'app/shared/services/auth.service';
import { ClimatePriceService } from 'app/shared/services/climate-price.service';
import { NavbarItemComponent } from 'app/standalone-components/navbar-item/navbar-item.component';
@Component({
  selector: 'app-climate-price-header',
  templateUrl: './climate-price-header.component.html',
  styleUrls: ['./climate-price-header.component.scss']
})
export class ClimatePriceHeaderComponent implements OnInit, OnDestroy {

  @ViewChild(NavbarItemComponent) navbarItemComponent: NavbarItemComponent
  @Output() Scroll = new EventEmitter()
  @Input() selectedSection: string = ''
  headerOptions: Array<Object> = [
    { id: 1, section: 'Overview', path: '/portfolio-analytics/overview' },
    { id: 2, section: 'Multi-asset View', path: '/portfolio-analytics/multiple-assets' },
    { id: 3, section: 'Single-asset View', path: '/portfolio-analytics/single-asset' },
  ]
  comparisonCount: number = null
  headerId: string;

  constructor(private _climatePriceService: ClimatePriceService, private _authService: AuthService, private _appService: AppService) {
    this.comparisonCount = this._climatePriceService.getComparisonList()?.length
    this.headerId = this._authService.isPublicLink() ? 'public-link-header' : 'sliding-header'
  }

  ngOnInit(): void {
    if (this._authService.isPublicLink()) {
      setTimeout(() => {
        this.selectedSection == this.headerOptions[0]['section'] ? document.getElementById('overview-portfolio-analytics').style.top = '10px' : ''
        this.selectedSection == this.headerOptions[1]['section'] ? document.getElementById('multi-asset').style.top = '10px' : ''
        this.selectedSection == this.headerOptions[2]['section'] ? document.getElementById('single-asset').style.top = '10px' : ''
        window.location.pathname == '/portfolio-analytics/comparison' ? document.getElementById('comparison').style.top = '20px' : ''
      })
    } else {
      this._appService.setSlidingHeader()
      window.onscroll = () => {
        this._appService.onScroll()
        this.Scroll.next()
      }
    }
  }

  ngOnDestroy(): void {
    this._appService.setAppHeader()
  }

}
