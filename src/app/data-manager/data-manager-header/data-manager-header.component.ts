import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AppService } from 'app/shared/services/app.service';
import { ClimatePriceService } from 'app/shared/services/climate-price.service';

@Component({
  selector: 'app-data-manager-header',
  templateUrl: './data-manager-header.component.html',
  styleUrls: ['./data-manager-header.component.scss']
})
export class DataManagerHeaderComponent implements OnInit, OnDestroy {

  @Output() Scroll = new EventEmitter();
  headerOptions: Array<Object> = [
    { id: 1, section: 'Summary', path: 'summary' },
    { id: 2, section: 'Assets', path: 'assets' },
  ]
  @Input() selectedSection: string = this.headerOptions[0]['section']

  constructor(private _appService: AppService) { }

  ngOnInit(): void {
    this._appService.setSlidingHeader()
    window.onscroll = () => {
      this._appService.onScroll()
      this.Scroll.next()
    }
  }

  ngOnDestroy(): void { this._appService.setAppHeader() }

}
