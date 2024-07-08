import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ImpactAnalysisSummary, NationAverage, TierHeadings } from 'app/climate-price/climate-price.interface';
import { IndexConstants } from 'app/index/index-constants';
import { ClimatePriceService } from 'app/shared/services/climate-price.service';

@Component({
  selector: 'app-impact-analyzer-table',
  templateUrl: './impact-analyzer-table.component.html',
  styleUrls: ['./impact-analyzer-table.component.scss']
})
export class ImpactAnalyzerTableComponent implements OnInit {

  @Output() ApiError = new EventEmitter();
  count1: number = null;
  count2: number = null;
  count3: number = null;
  count4: number = null;
  nationalAvg: NationAverage;
  data: ImpactAnalysisSummary[];
  tableDataDeepCopy: Array<ImpactAnalysisSummary>;  // deep copy of table data to maintain search functionality
  allExpandedNodeList: Array<ImpactAnalysisSummary> = []
  currentExpandedRow = Object.assign({});
  ascendingOrder: boolean = false
  tierHeadings: TierHeadings = {
    tier1: '',
    tier2: '',
    tier3: '',
    tier4: '',
  };
  // virtually loading records on scroll when data is very large or greater than 1000 after expand all
  virtualLoadLimit: number = 1000
  chunks = []
  selectedBenchmarkData;

  constructor(private _climatePriceService: ClimatePriceService, private _cdr: ChangeDetectorRef) { }

  ngOnInit(): void { }

  onScroll() {
    if (this.allExpandedNodeList.length < this.virtualLoadLimit) return;
    if (this.chunks.length) {
      const data = this.allExpandedNodeList.filter((m, i) => (i > this.data.length - 1 && i < this.chunks[0]))
      this.data = [...this.data, ...data]
      this.chunks.splice(0, 1)
    }
  }

  async getData(scenario = IndexConstants.DefaultScenario) {
    try {
      this.data = undefined
      let response = await this._climatePriceService.getSummaryData({ scenario: scenario })
      this.data = response['data']
      this.nationalAvg = response['national_avg']
      this.tierHeadings = response['tier_headings']
      this.data = this.data.map((m) => { return { ...m, expanded: false, level: 1, class: m.data.uuid } })
      this.tableDataDeepCopy = structuredClone(this.data)
      this.getBreadCrumbs()
      return response
    } catch (e) {
      console.log(e)
      this.ApiError.next(e.message)
    }
  }

  search(input: string) {
    const temp = structuredClone(this.tableDataDeepCopy.map((m) => { return { ...m, expanded: false } }))
    if (input.length) {
      this.data = temp.filter(m => m.data.title.toLowerCase().includes(input.toLowerCase()))
    } else {
      this.data = temp
    }
  }

  getBreadCrumbs() {
    this.count1 = this.data.length

    let sceondLevelData = Array.from(this.tableDataDeepCopy, ({ children }) => children).flat()
    sceondLevelData = sceondLevelData.filter(_ => _?.children).filter(Boolean)
    this.count2 = sceondLevelData.length

    let thirdLevelData = Array.from(sceondLevelData, ({ children }) => children).flat()
    thirdLevelData = thirdLevelData.filter(_ => _?.children).filter(Boolean)
    this.count3 = thirdLevelData.length

    let fourthLevelData = Array.from(thirdLevelData, ({ children }) => children).flat()
    fourthLevelData = fourthLevelData.filter(_ => _?.children).filter(Boolean)
    this.count4 = fourthLevelData.length
  }

  recursive(item, idx) {
    item.expanded = true
    this.allExpandedNodeList.push(item)
    if (item.children && item.children.length) {
      item.children.forEach((m, i) => {
        m.level = item.level + 1;
        m.paddingLeft = `${(m.level * 20) - 20}px`
        m.class = `${item.class}____${m.data.uuid}`
        m.children ? this.recursive(m, i) : this.allExpandedNodeList.push(m)
      })
    }
  }

  expandAll(): void {
    this.allExpandedNodeList = []
    const temp = structuredClone(this.tableDataDeepCopy)
    temp.forEach((item, idx) => {
      this.recursive(item, idx)
    })
    // this.data = structuredClone(this.allExpandedNodeList)
    if (this.allExpandedNodeList.length < this.virtualLoadLimit) {
      this.data = structuredClone(this.allExpandedNodeList)
    } else {
      this.chunks = this.allExpandedNodeList.map((m, i) => { return m.level == 1 ? i : null }).filter(Boolean)
      this.data = structuredClone(this.allExpandedNodeList.filter((m, i) => i < this.chunks[0]))
      this.chunks.splice(0, 1)
    }
  }

  collapseAll(): void {
    this.data = structuredClone(this.tableDataDeepCopy.map((m) => { return { ...m, expanded: false } }))
  }

  expandRow(item, idx): void {

    // for callapsing the pervious expanded row
    if (Object.keys(this.currentExpandedRow).length && item.level == 1) {
      this.collapseRow(this.currentExpandedRow.data, this.currentExpandedRow.index)
      idx = this.data.findIndex((m) => m.data.uuid == item.data.uuid)
      item = this.data[idx]
    }

    item.expanded = true
    item.children.forEach((m, i) => {
      m.expanded = false;
      m.level = item.level + 1;
      if (m.level > 1) m.paddingLeft = `${(m.level * 20) - 20}px`
      // here including parents ids seperated by (___) with every child node. using it during collapsing of a row. every child node will aassociated with its all parents uuids
      m.class = `${item.class}____${m.data.uuid}`
      this.data.splice(idx + 1 + i, 0, m)
    })

    if (item.level == 1) {
      this.currentExpandedRow.index = idx
      this.currentExpandedRow.data = item
    }
  }

  getCount(item, idx) {
    let list = []
    for (let i = 0; i < this.data.length; i++) {
      if (i == idx) {
        continue;
      } else if (this.data[i]['class'].includes(item.class)) {
        list.push(i)
      }
    }
    return list.length
  }

  collapseRow(item, idx): void {
    item.expanded = false
    const uuid = item.data.uuid
    let indexesToBeRemoved = []
    // getting all the rows which includes clicked uuids
    for (let i = 0; i < this.data.length; i++) {
      if (i == idx) {
        continue;
      } else if (this.data[i]['class'].includes(uuid)) {
        indexesToBeRemoved.push(i)
      }
    }
    this.data = this.data.filter((m, i) => !indexesToBeRemoved.includes(i))
  }

  sort(): void {
    const temp = structuredClone(this.tableDataDeepCopy)
    this.ascendingOrder = !this.ascendingOrder
    this.data = this.ascendingOrder ? temp.sort((a, b) => a.data.title.localeCompare(b.data.title)) : temp.sort((a, b) => b.data.title.localeCompare(a.data.title))
  }

}
