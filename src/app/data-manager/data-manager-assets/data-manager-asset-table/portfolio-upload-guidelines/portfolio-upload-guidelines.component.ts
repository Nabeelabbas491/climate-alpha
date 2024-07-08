import { Component, OnInit } from '@angular/core';
import { AppConstants } from 'app/shared/data/constants';

@Component({
  selector: 'app-portfolio-upload-guidelines',
  templateUrl: './portfolio-upload-guidelines.component.html',
  styleUrls: ['./portfolio-upload-guidelines.component.scss']
})
export class PortfolioUploadGuidelinesComponent implements OnInit {

  docsData = AppConstants.CLIENT_DATA_SAMPLE;
  optionalDocsData = AppConstants.CLIENT_DATA_SAMPLE_OPTIONAL;
  optionalPortfolioMetadata = AppConstants.CLIENT_DATA_SAMPLE_PORTFOLIO_METADATA
  constructor() { }

  ngOnInit(): void {
  }

}
