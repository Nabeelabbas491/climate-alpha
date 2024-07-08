import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ClimatePriceService } from 'app/shared/services/climate-price.service';
import { DataMangerSummary } from '../data-manager.Interface';
import { NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Messages } from 'app/shared/data/messages';
import { DataManagerFiltersComponent } from './data-manager-filters/data-manager-filters.component';
import { DataManagerService } from 'app/shared/services/data-manager.service';
import { ToastrService } from 'ngx-toastr';
import { AddNewTeirModalComponent } from './add-new-teir-modal/add-new-teir-modal.component';
import { Role } from 'app/shared/data/roles';
import { AuthService } from 'app/shared/services/auth.service';

@Component({
  selector: 'app-data-manager-summary',
  templateUrl: './data-manager-summary.component.html',
  styleUrls: ['./data-manager-summary.component.scss']
})
export class DataManagerSummaryComponent implements OnInit {

  @ViewChild(NgbDropdown) menu: NgbDropdown;
  @ViewChild('modal') modalRef: ElementRef
  @ViewChild(DataManagerFiltersComponent) dataManagerFiltersComponent: DataManagerFiltersComponent
  @ViewChild(AddNewTeirModalComponent) addNewTeirModalComponent: AddNewTeirModalComponent
  count1: number = null;
  count2: number = null;
  count3: number = null;
  count4: number = null;
  allChecked: boolean = false
  showDataProcessingMessage: boolean = false
  dataMessage: string = Messages.SUMMARY;
  firstColumnName: string = ''
  tier_4: Array<string> = []
  data: DataMangerSummary[];
  tableDataDeepCopy: Array<DataMangerSummary>;  // deep copy of table data to maintain search functionality
  allExpandedNodeList: Array<DataMangerSummary> = []
  currentExpandedRow = Object.assign({});
  ascendingOrder: boolean = false
  rowAction: string | null;
  selectedRows: Array<DataMangerSummary>;
  menuItems: Object[] = [
    {
      name: "Edit Selected",
      action: "edit",
      icon: "assets/img/svg/data-manager/edit-icon.svg"
    },
    {
      name: "Duplicate Selected",
      action: "duplicate",
      icon: "assets/img/svg/climate_price/Copy.svg"
    },
    {
      name: "Delete Selected",
      action: "delete",
      icon: "assets/img/svg/climate_price/carbon_delete_red.svg",
      color: '#810000'
    },
  ]
  // virtually loading records on scroll when data is very large or greater than 1000 after expand all
  virtualLoadLimit: number = 1000
  chunks = []
  isTrialUser: boolean;


  constructor(private _climatePriceService: ClimatePriceService,
    private _toastr: ToastrService,
    private modalService: NgbModal,
    private _authService: AuthService,
  ) {
    const user = this._authService.admin
    this.isTrialUser = user.roles.includes(Role.ROLES.PORTFOLIO_ANALYTICS_TRIAL)
  }

  async ngOnInit(): Promise<void> {
    this.getData()
  }

  onScroll() {
    if (this.allExpandedNodeList.length < this.virtualLoadLimit) return;
    if (this.chunks.length) {
      const data = this.allExpandedNodeList.filter((m, i) => (i > this.data.length - 1 && i < this.chunks[0]))
      this.data = [...this.data, ...data]
      this.chunks.splice(0, 1)
    }
  }

  search(input: string) {
    const temp = structuredClone(this.tableDataDeepCopy.map((m) => { return { ...m, expanded: false } }))
    if (input.length) {
      this.data = temp.filter(m => m.data.name.toLowerCase().includes(input.toLowerCase()))
    } else {
      this.data = temp
    }
  }

  applyFilters(tier4List): void {
    this.tier_4 = tier4List
    this.getData()
  }

  async getData(): Promise<void> {
    try {
      this.data = undefined
      let response = await this._climatePriceService.getDataManagerSummaryData({ tier_4_ids: this.tier_4 })
      this.data = response['data']
      this.data = this.data.map((m) => { return { ...m, expanded: false, level: 1, class: m.data.uuid, checkbox: false, editRow: false } })
      this.tableDataDeepCopy = structuredClone(this.data)
      this.getBreadCrumbs()
    } catch (e) {
      this.data = undefined;
      this.dataMessage = e.message;
      this.showDataProcessingMessage = true;
    }
  }

  getBreadCrumbs(): void {
    this.count1 = this.data.length

    let sceondLevelData = Array.from(this.tableDataDeepCopy, ({ children }) => children).flat()
    sceondLevelData = sceondLevelData.filter(Boolean)
    this.count2 = sceondLevelData.length

    let thirdLevelData = Array.from(sceondLevelData, ({ children }) => children).flat()
    thirdLevelData = thirdLevelData.filter(Boolean)
    this.count3 = thirdLevelData.length

    let fourthLevelData = Array.from(thirdLevelData, ({ children }) => children).flat()
    fourthLevelData = fourthLevelData.filter(Boolean)
    this.count4 = fourthLevelData.length
  }

  recursive(item: DataMangerSummary, idx: number): void {
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

  expandRowToSpecificLevel(rowIdx, level) {
    for (let i = 0; i < level - 1; i++) {
      const idx = rowIdx + i
      const item = this.data[idx]
      this.expandRow(item, idx)
    }
  }

  expandRow(item: DataMangerSummary, idx: number): void {
    // for callapsing the pervious expanded row
    if (Object.keys(this.currentExpandedRow).length && item.level == 1) {
      this.collapseRow(this.currentExpandedRow.data, this.currentExpandedRow.index)
      idx = this.data.findIndex((m) => m.data.uuid == item.data.uuid)
      item = this.data[idx]
    }

    if (!item.children) return
    item.expanded = true
    item.children?.forEach((m, i) => {
      m.expanded = false;
      m.level = item.level + 1;
      if (m.level > 1) m.paddingLeft = `${(m.level * 20) - 20}px`
      // here including parents ids seperated by (___) with every child node. using it during collapsing of a row. every child node will aassociated with its all parents uuids
      m.class = `${item.class}____${m.data.uuid}`
      m.checkbox = "newTier" in m ? true : this.allChecked
      // if (this.data.findIndex(_ => _.class == m.class) == -1) this.data.splice(idx + 1 + i, 0, m)
      this.data.splice(idx + 1 + i, 0, m)
    })

    if (item.level == 1) {
      this.currentExpandedRow.index = idx
      this.currentExpandedRow.data = item
    }
    this.hideOrShowActionColumn()
  }

  collapseRow(item: DataMangerSummary, idx: number): void {
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
    this.hideOrShowActionColumn()
  }

  sort(): void {
    const temp = structuredClone(this.tableDataDeepCopy)
    this.ascendingOrder = !this.ascendingOrder
    this.data = this.ascendingOrder ? temp.sort((a, b) => a.data.name.localeCompare(b.data.name)) : temp.sort((a, b) => b.data.name.localeCompare(a.data.name))
  }

  onHeaderColumnCheckboxChange(event) {
    this.data = this.data.map((m) => { return { ...m, checkbox: event.target.checked, editRow: event.target.checked ? m.editRow : false } })
    this.hideOrShowActionColumn()
  }

  // onCheckBoxChange(item: DataMangerSummary, idx: number) {
  //   if (item.checkbox && item.children) {
  //     this.collapseRow(item, idx)
  //   }
  // }

  onRightclick(event, idx): void {
    this.selectedRows = structuredClone(this.data.filter((m) => m.checkbox))
    if (this.selectedRows.length) {
      const row = document.getElementById(`data-manager-summary-${idx}`)
      const element = document.getElementById("right_menu")
      element.style.top = `${row.offsetTop + 60}px`
      element.style.left = `60px`
      this.menu.open()
    }
  }

  async onMenuItemSelection(item) {
    this.data = this.data.map((m) => { return { ...m, editRow: false } })
    this.rowAction = item.action
    switch (item.action) {
      case "edit":
        this.data = this.data.map((m) => { return { ...m, editRow: m.checkbox } })
        return;
      case "duplicate":
        this.openModal()
        return;
      case "delete":
        this.openModal()
        return;
    }
  }

  async dublicateRows(): Promise<void> {
    try {
      const body = { tier_ids: this.selectedRows.map((item) => { return { uuid: item.data.uuid, tier: item.level } }) }
      await this._climatePriceService.dublicateRowsOfDataManagerSummary(body)
      await this.getData()
      this.hideOrShowActionColumn()
    } catch (e) { }
  }

  async deleteRows(): Promise<void> {
    try {
      const body = { tier_ids: this.selectedRows.map((item) => { return { uuid: item.data.uuid, tier: item.level } }) }
      await this._climatePriceService.deleteRowsOfDataManagerSummary(body)
      await this.getData()
      this.hideOrShowActionColumn()
    } catch (e) { 
      this._toastr.error(e.detail)
    }
  }

  hideOrShowActionColumn(): void {
    // const selectedRows = this.data.filter(m => m.checkbox)
    // if (!selectedRows.length) {
    //   this.rowAction = null
    // } else {
    //   this.rowAction = this.data.findIndex(_ => _['newTier']) > -1 && 'edit'
    // }
    this.rowAction = this.data.findIndex(_ => _.editRow) > -1 ? 'edit' : ''
  }

  validateRow(item) {
    if (item.data.name && item.data.description) {
      return {
        tier_number: item.level,
        tier_id: item.data.uuid,
        updated_name: item.data.name,
        description: item.data.description
      }
    }
    let errorMsg = !item.data.name && !item.data.description ? 'Name and Descriptions are required' :
      !item.data.name ? 'Name is required' : !item.data.description ? 'Description is required' : ''
    return { invalid: true, errorMsg: errorMsg, ...item }
  }

  async onTick(item, idx) {
    try {
      const validatedRow = this.validateRow(item)
      if (validatedRow.invalid) return this._toastr.error(validatedRow.errorMsg);
      if (item.data.uuid) {
        await this._climatePriceService.updateRowsOfDataManagerSummary([validatedRow])
        item.checkbox = false, item.editRow = false
      } else {
        const body = {
          tier_number: item.level,
          name: item.data.name,
          parent_id: item.parentId,
          description: item.data.description
        }
        let response: any = await this._climatePriceService.createNewTier(body)
        switch (item.level) {
          case 1:
            this.dataManagerFiltersComponent.tiersDropdownsComponent.tierOneList.unshift(response)
            break;
          case 2:
            this.dataManagerFiltersComponent.tiersDropdownsComponent.tierTwoList.unshift(response)
            break;
          case 3:
            this.dataManagerFiltersComponent.tiersDropdownsComponent.tierThreeList.unshift(response)
            break;
          case 4:
            this.dataManagerFiltersComponent.tiersDropdownsComponent.tierFourList.unshift(response)
            break;
        }
        // this.data[idx] = { children: [], data: { ...response }, checkbox: false, editRow: false, level: item.level }
        await this.getData()
      }
      this.hideOrShowActionColumn()
    } catch (e) { }
  }

  async onTickAll() {
    let body = this.data.filter(_ => _.editRow).map(m => this.validateRow(m))
    let invalidRows = body.filter(_ => _.invalid)
    if (invalidRows.length) {
      invalidRows.forEach((m) => {
        const idx = this.data.findIndex(_ => _.data.uuid == m.data.uuid)
        this._toastr.error(`Row # ${idx + 1} : ${m.errorMsg}`)
      })
    } else {
      await this._climatePriceService.updateRowsOfDataManagerSummary(body)
      this.data = this.data.map((m) => { return { ...m, checkbox: false, editRow: false } })
      this.hideOrShowActionColumn()
    }
  }

  onCross(item, rowIdx): void {
    if (!item.newTier) {
      const canceledRow: DataMangerSummary = this.selectedRows.find((m) => m.data.uuid == item.data.uuid)
      canceledRow.editRow = false, canceledRow.checkbox = false
      this.data[rowIdx] = structuredClone(canceledRow)
    } else {
      if (this.data[rowIdx]['parentId']) {
        const parentNode = this.data.find(_ => _.data.uuid == this.data[rowIdx]['parentId'])
        if (parentNode.children.length) parentNode.children.shift()
      }
      this.data.splice(rowIdx, 1)
    }
    this.hideOrShowActionColumn()
  }

  onCrossAll = () => (this.data.forEach((item, idx) => { item.editRow && this.onCross(item, idx) }), this.allChecked = false)

  openModal(): void {
    this.modalService.open(this.modalRef, {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title',
      scrollable: true,
      backdrop: 'static',
      centered: true
    }).result.then((result) => { }, (reason) => { })
  }

  openAddNewTierModal() {
    this.addNewTeirModalComponent.openModal(this.addNewTeirModalComponent.modalRef)
    this.addNewTeirModalComponent.tierHeadings = this.dataManagerFiltersComponent.tiersDropdownsComponent.tierHeadings
  }

  async confirm() {
    switch (this.rowAction) {
      case "duplicate":
        await this.dublicateRows()
        break;
      case "delete":
        await this.deleteRows()
        break;
    }
    this.closeModal()
  }

  closeModal(): void {
    this.modalService.dismissAll()
  }

  addNewTierRow(form) {
    const newRow = (parentNode = undefined): any => {
      return {
        data: { name: '', description: '', property_count: null },
        level: parentNode ? parentNode.level + 1 : 1,
        paddingLeft: uuids.length * 20 + 'px',
        class: '',
        editRow: true,
        checkbox: true,
        newTier: true,
        parentId: parentNode ? parentNode.data.uuid : null
      }
    }
    this.rowAction = "edit"
    const uuids = Object.values(form).filter(Boolean)
    !uuids.length && this.data.unshift(newRow())
    uuids.forEach((item, i) => {
      let idx = this.data.findIndex(_ => item == _.data.uuid)
      if (i == uuids.length - 1) {
        //  last item is where inside we need to show new row
        this.data[idx].children.unshift(newRow(this.data[idx]))
      }
      this.expandRow(this.data[idx], idx)
    })
    setTimeout(() => {
      let idx = this.data.findIndex(_ => _.data.uuid == uuids[0])
      document.getElementById(`data-manager-summary-${idx}`).scrollIntoView({ behavior: "smooth" })
    })
  }

  get showBulkOperationIcons() {
    const isNewTierExist = this.data.findIndex(_ => _['newTier']) > -1
    const checkedRowsCount = this.data.filter(_ => _.editRow).length
    return checkedRowsCount > 1 && !isNewTierExist
  }

}



