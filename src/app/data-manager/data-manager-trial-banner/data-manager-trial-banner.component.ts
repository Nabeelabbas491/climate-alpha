import { Component } from '@angular/core';
import { AuthService } from 'app/shared/services/auth.service';

@Component({
  selector: 'app-data-manager-trial-banner',
  templateUrl: './data-manager-trial-banner.component.html',
  styleUrls: ['./data-manager-trial-banner.component.scss']
})
export class DataManagerTrialBannerComponent {

  isTrialUser: boolean;

  constructor(private _authService: AuthService) {
    this.isTrialUser = this._authService.isPortfolioAnalyticsTrialUser()
  }


}
