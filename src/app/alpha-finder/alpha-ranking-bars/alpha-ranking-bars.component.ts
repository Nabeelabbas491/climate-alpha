import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Role } from 'app/shared/data/roles';
import { AlphaFinderService } from 'app/shared/services/alpha-finder.service';
import { AuthService } from 'app/shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-alpha-ranking-bars',
  templateUrl: './alpha-ranking-bars.component.html',
  styleUrls: ['./alpha-ranking-bars.component.scss']
})
export class AlphaRankingBarsComponent implements OnInit {

  @ViewChild('modal') modalRef: ElementRef
  @ViewChild('countyModal') countyModalRef: ElementRef
  @Input() rankingType;
  @Input() show_footer = true
  @Input() pdfFilters;
  title = ''
  modalTitle = ''
  selectedType = ''
  barsListing = []
  disable_forecaster_btn = false
  hasAccessToLocationExplorer;


  constructor(private modalService: NgbModal,
    private toastr: ToastrService,
    private authService: AuthService,
    private alphaFinderService: AlphaFinderService,
    private router: Router) {
    let user = authService.admin
    this.hasAccessToLocationExplorer = Role.hasAccess(user?.roles, [Role.ROLES.SUPER_ADMIN, Role.ROLES.LOCATION_EXPLORER])
  }

  ngOnInit(): void { }

  mapOneRangeToAnother(value, in_min, in_max, out_min, out_max) {
    let val = (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    if (val < out_min) val = out_min;
    else if (val > out_max) val = out_max;
    return `${Math.trunc(val)}%`;
  }

  openModal(content) {
    // @todo, Remove this when proper roles are handled , right now doing only this for alpha finder user 
    let user = this.authService.admin
    let maxRole = Math.max.apply(Math, user.roles)
    if (maxRole == 300) {
      return;
    }
    // 
    this.modalService.open(content, {
      size: 'xl',
      ariaLabelledBy: 'modal-basic-title',
      scrollable: true,
      backdrop: true,
      centered: true
    }).result.then((result) => { }, (reason) => { });
  }

  closeModal() {
    this.modalService.dismissAll()
  }

  exportDataToForecaster() {
    // 0 index color #616161
    // 1 index color #FB9434
    // 2 index color #FB9434
    let user_selected_items: any = this.getUserCheckedItems()
    if (!user_selected_items.length) return this.toastr.error("Please select a county!")
    if (user_selected_items.length > 3) return;
    this.alphaFinderService.setExportedData({ userSelection: user_selected_items, pdfFilters: this.pdfFilters })
    let path = user_selected_items[0].rankingType === 'counties' ? '/forecaster/county' : '/forecaster/zipcode'
    this.router.navigate([path])
    this.modalService.dismissAll()
  }

  exportDataToClimatePrice() {
    let data = this.getUserCheckedItems()
    localStorage.setItem('AF_to_CP', JSON.stringify(data))
    this.closeModal()
    this.router.navigate(['/data/portfolio_overview'])
  }

  getUserCheckedItems() {
    // it will return us data with complete information of rankings including , zipcode, lat, lon, state, country, State_Initials, county_name etc
    return this.barsListing.filter((item) => { return item.export })
  }

  onCountyForecasterItemChecked() {
    let user_selected_items = this.getUserCheckedItems();
    if (user_selected_items.length >= 3) {
      this.barsListing = this.barsListing.map((item) => {
        return { ...item, disabled: item.export ? false : true }
      })
    } else {
      this.barsListing = this.barsListing.map((item) => {
        return { ...item, disabled: false }
      })
    }
  }

  onZipCodesItemChecked() {
    this.disable_forecaster_btn = this.getUserCheckedItems().length > 3 ? true : false
  }

}
