import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClimatePrice } from 'app/climate-price/climate-price.utils';
import { ClimatePriceService } from 'app/shared/services/climate-price.service';
import { BenchMarkParamType, Benchmark, SelectedBenchMarkEvent } from '../index-interface';

@Component({
  selector: 'app-benhmark-dropdown',
  templateUrl: './benhmark-dropdown.component.html',
  styleUrls: ['./benhmark-dropdown.component.scss']
})
export class BenhmarkDropdownComponent {

  @Output() BenchMarkSelection = new EventEmitter<SelectedBenchMarkEvent>();
  selectedBenchmark: string = ''
  dropdownList: string[] = []
  description: string = ''
  isComparisonComponent: Boolean = ClimatePrice.isComarisonComponent()
  response: any;

  constructor(private _climatePriceService: ClimatePriceService) { }

  setBenchMarkDropdown(data, selectedItem = undefined) {
    this.response = data;
    this.dropdownList = this.response.risk.map((item) => item.Title)
    this.selectedBenchmark = selectedItem || this.response.risk.find(x => x.Title == 'Country Benchmark')?.Title || this.dropdownList[0]
    this.selectBenchmark(this.selectedBenchmark)
  }

  selectBenchmark($event) {
    const risk = this.response.risk.find(_ => _.Title == $event)
    const resilience = this.response.resilience?.find(_ => _.Title == $event)
    this.description = risk.Desc
    this.BenchMarkSelection.emit({ risk: risk, resilience: resilience })
  }

  setServiceVariable = (event) => { if (this.isComparisonComponent) this._climatePriceService.selectedBenchMark = event }

}
