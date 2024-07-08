import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Scenario } from '../climate-price.interface';
import { ImpactAnalyzerTableComponent } from './impact-analyzer-table/impact-analyzer-table.component';
import { Messages } from 'app/shared/data/messages';
import { AppService } from 'app/shared/services/app.service';
import { IndexConstants } from 'app/index/index-constants';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements AfterViewInit {

  @ViewChild(ImpactAnalyzerTableComponent) impactAnalyzerTableComponent: ImpactAnalyzerTableComponent
  scenarioList: Array<Scenario> = IndexConstants.Scenarios
  selectedScenario: string = IndexConstants.DefaultScenario;
  benchMarkList: Array<string> = []
  selectedBenhmark: string = ''
  showDataProcessingMessage: boolean = false
  dataMessage: string = Messages.SUMMARY;
  response;

  constructor(public _appService: AppService) { }

  async ngAfterViewInit(): Promise<void> { await this.onScenarioChange() }

  async onScenarioChange() {
    try {
      this._appService.filters = { 'scenario': this.selectedScenario }
      this.response = await this.impactAnalyzerTableComponent.getData(this.selectedScenario)
      this.benchMarkList = ["Global Benchmark"]
      this.selectedBenhmark = this.benchMarkList[0]
    } catch (e) {
      console.log(e)
    }
  }

  showError(e) {
    this.dataMessage = e;
    this.showDataProcessingMessage = true;
  }


}
