import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppService } from 'app/shared/services/app.service';
import { ToastrService } from 'ngx-toastr';
import { PublicLink } from '../navbar-item.component';
import { ApiService } from 'app/shared/services/api.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ClimatePrice } from 'app/climate-price/climate-price.utils';
import { AppPermission } from 'app/shared/data/roles';

@Component({
  selector: 'app-shareable-link',
  standalone: true,
  imports: [CommonModule, NgSelectModule, FormsModule],
  templateUrl: './shareable-link.component.html',
  styleUrls: ['./shareable-link.component.scss']
})
export class ShareableLinkComponent {

  expiryList = [
    { label: '7 Days', value: 7 },
    { label: '14 Days', value: 14 },
    { label: '30 Days', value: 30 },
    { label: 'No Expiry', value: 0 },
  ];
  selectedExpiry: number = this.expiryList[0].value;
  linkCopied: boolean = false
  permissions = AppPermission.get().PorftolioAnalytics_DataManager

  constructor(public _apiService: ApiService,
    private _appService: AppService,
    private _toastr: ToastrService) { }


  async getShareableLink() {
    if (this.linkCopied) return;
    const body = {
      'expiry_time': this.selectedExpiry,
      'saved_filters': this._appService.filters,
      'route': `/portfolio-analytics/multiple-assets`
    }
    this._apiService.post('shareable_link/', body).subscribe((response) => {
      navigator.clipboard.writeText(response.url)
      this._toastr.success("Link copied successfully.")
      this.linkCopied = true
    }, err => { })
  }



}
