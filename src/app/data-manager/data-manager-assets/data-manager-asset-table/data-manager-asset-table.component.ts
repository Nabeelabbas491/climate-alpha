import { Component, OnInit, ViewChild, ElementRef, ViewChildren, EventEmitter, Output, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDropdown, NgbModal, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppConstants } from 'app/shared/data/constants';
import { ClimatePriceService } from 'app/shared/services/climate-price.service';
import { DataManagerService } from 'app/shared/services/data-manager.service';
import { CreatePortfolioDialogComponent } from 'app/standalone-components/create-portfolio-dialog/create-portfolio-dialog.component';
import { DataManager } from 'app/data-manager/data-manager.utils';
import { AssetTableEvent } from 'app/data-manager/data-manager.Interface';
import { TierHeadings } from 'app/climate-price/climate-price.interface';
import { AppPermission, Role } from 'app/shared/data/roles';
import { NgSelectComponent } from '@ng-select/ng-select';
import { AuthService } from 'app/shared/services/auth.service';

@Component({
  selector: 'app-data-manager-asset-table',
  templateUrl: './data-manager-asset-table.component.html',
  styleUrls: ['./data-manager-asset-table.component.scss']
})
export class DataManagerAssetTable implements OnInit {

  @ViewChildren(NgSelectComponent) ngSelect: NgSelectComponent;
  @ViewChild(NgbDropdown) menu: NgbDropdown;
  @ViewChildren(NgbPopover) popover: NgbPopover;
  @ViewChild(CreatePortfolioDialogComponent) createPortfolioDialogComponent: CreatePortfolioDialogComponent
  @ViewChild('modal') actionModalRef: ElementRef
  @ViewChild('input') input: ElementRef
  @Output() FiltersEvent = new EventEmitter<AssetTableEvent>();
  filterformValues
  rowsPerPage: number = 10;
  pageNumber: number = 1;
  assets: any = [];
  search: string;
  tierOneList: any
  rowAction = ''
  showCheckBoxColumn: boolean = true
  selectedRows = []
  tempRows = []  // this is used to handle revert row functionality only when isAllAssetSelected is true as in that case we to keep selectedRows epmty
  selectedPortfolio = null;
  headerCheckBox = false
  totalAssets: number = null
  modalConfig: any = {}
  isAllAssetSelected: boolean = false
  icons = {
    'Failed': 'assets/img/svg/data-manager/asset-table/failed.svg',
    'Processing': 'assets/img/svg/data-manager/asset-table/processing.svg',
    'Processed': 'assets/img/svg/data-manager/asset-table/processed.svg'
  }
  headers = [
    { title: 'Status', sort: 'desc', key: 'process_status', type: 'string', color: '#4a7182', show: false },
    { title: 'Address ', sortOrder: 'desc', sortBy: 'address', type: 'string', color: '#4a7182', show: true },
    { title: 'City', sortOrder: 'desc', sortBy: 'city', type: 'string', color: '#4a7182', show: true },
    { title: 'State/Province', sortOrder: 'desc', sortBy: 'state', type: 'string', color: '#4a7182', show: true },
    { title: 'ZIP/Postal Code', sortOrder: 'desc', sortBy: 'zip_code', type: 'string', color: '#4a7182', show: true },
    { title: 'Country', sortOrder: 'desc', sortBy: 'country', type: 'string', color: '#4a7182', show: true },
    { title: 'Property Type', sortOrder: 'desc', sortBy: 'asset_class', type: 'string', color: '#4a7182', show: true },
    { title: 'Latitude', sortOrder: 'desc', sortBy: 'latitude', type: 'string', color: '#4a7182', show: true },
    { title: 'Longitude', sortOrder: 'desc', sortBy: 'longitude', type: 'string', color: '#4a7182', show: true },
    { title: 'Property Name', sortOrder: 'desc', sortBy: 'title', type: 'string', color: '#4a7182', show: true },
    { title: 'Valuation ($)', sortOrder: 'desc', sortBy: 'valuation', type: 'number', color: '#4a7182', show: true },
    { title: 'Year of Valuation', sortOrder: 'desc', sortBy: 'year_valuation', type: 'number', color: '#4a7182', show: true },
    { title: 'Tier 1', sortOrder: 'desc', sortBy: 'file__portfolio_name', type: 'string', color: '#4a7182', show: true },
    { title: 'Tier 2', sortOrder: 'desc', sortBy: 'tier_4__parent__parent__name', tierId: 'tier_2_id', type: 'string', color: '#4a7182', show: true },
    { title: 'Tier 3', sortOrder: 'desc', sortBy: 'tier_4__parent__name', tierId: 'tier_3_id', type: 'string', color: '#4a7182', show: true },
    { title: 'Tier 4', sortOrder: 'desc', sortBy: 'tier_4__name', tierId: 'tier_4', type: 'string', color: '#4a7182', show: true },
  ];
  menuItems = [
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
  filters = Object.assign({});
  staticCols = Object.assign({});;
  propertyTypes: string[] = [];
  permissions = AppPermission.get().PorftolioAnalytics_DataManager
  sortOrder: string;
  sortBy: string;
  selectedRowIndex = null
  isTrialUser: boolean;

  constructor(private _dataManagerService: DataManagerService,
    private toastr: ToastrService,
    private _router: Router,
    private _authService: AuthService,
    private _climatePriceService: ClimatePriceService,
    private modalService: NgbModal) {
    this.initailizedApiParams()

    const user = this._authService.admin
    this.isTrialUser = user.roles.includes(Role.ROLES.PORTFOLIO_ANALYTICS_TRIAL)
    if (this.isTrialUser) this.menuItems.splice(1, 1)
  }

  async ngOnInit() {
    await this.getPropertyTypes()
    await this.getTierOneList()
    await this.getData()
    // await this.toggleFiltersEvent(DataManager.Events.crud)
    this.setStaticColumns()
  }

  async getPropertyTypes() {
    let response = await this._dataManagerService.getPropertyTypes()
    this.propertyTypes = response['property_types']
  }

  initailizedApiParams() {
    this.pageNumber = 1
    this.rowsPerPage = 10
    this.search = ''
    this.sortOrder = 'desc',
      this.sortBy = 'created_at'
    this.filters = {
      file__portfolio_name: ''
    }
  }

  async getData() {
    try {
      let response: any = await this._dataManagerService.getUserApiDataListing(this.pageNumber, this.search, this.rowsPerPage, this.filters, this.sortOrder, this.sortBy);
      this.totalAssets = response['count']
      this.assets = response['results']
      // as editable allowing only for current page so reseting row action on pagination
      this.rowAction = ''
      this.assets = this.assets.map((m) => {
        let tier2List = this.tierOneList?.find((item) => item.uuid == m.file)?.children
        let tier3List = tier2List?.find((item) => item.uuid == m.tier_2_id)?.children
        let tier4List = tier3List?.find((item) => item.uuid == m.tier_3_id)?.children
        return {
          ...m,
          file: m.file,
          checked: this.isAllAssetSelected ? true : this.selectedRows.length && this.selectedRows.findIndex(n => n.uuid == m.uuid) > -1,
          // editRow: this.isAllAssetSelected ? this.selectedRows.findIndex(n => n.uuid == m.uuid) == -1 && this.rowAction == this.menuItems[0].action : this.selectedRows.findIndex(n => n.uuid == m.uuid) > -1 && this.rowAction == this.menuItems[0].action,
          editRow: false,
          disableTier2: m.tier_2_name == '',
          disableTier3: m.tier_3_name == '',
          disableTier4: m.tier_4_name == '',
          tier2List: tier2List,
          tier3List: tier3List,
          tier4List: tier4List,
          propertyTypes: [...this.propertyTypes]
        }
      })
      this.rowAction = ''
      this.setStaticColumns()
    } catch (e) { }
  }

  async getTierOneList() {
    try {
      let response = await this._dataManagerService.getUserFiles()
      this.tierOneList = response['data']
      this.tierOneList = this.tierOneList.filter(obj => obj['name'] !== '');
      this.setTierNames(this.tierOneList[1].tier_headings)
    } catch (e) { }
  }

  setTierNames(names) {
    const tier1Idx = this.headers.findIndex(_ => _.title.includes('Tier 1'))
    const tier2Idx = this.headers.findIndex(_ => _.title.includes('Tier 2'))
    const tier3Idx = this.headers.findIndex(_ => _.title.includes('Tier 3'))
    const tier4Idx = this.headers.findIndex(_ => _.title.includes('Tier 4'))
    this.headers[tier1Idx].title = 'Tier 1' + (names.tier1 ? ' - ' + names.tier1 : '')
    this.headers[tier2Idx].title = 'Tier 2' + (names.tier2 ? ' - ' + names.tier2 : '')
    this.headers[tier3Idx].title = 'Tier 3' + (names.tier3 ? ' - ' + names.tier3 : '')
    this.headers[tier4Idx].title = 'Tier 4' + (names.tier4 ? ' - ' + names.tier4 : '')
  }

  closeAllOpenedPopovers() {
    this.popover['_results'].forEach((popover) => {
      popover.close()
    })
  }

  onCheckBoxChange(row) {
    if (this.isAllAssetSelected) {
      // In case of all asset selected , as we have paginated records so user can go to next pages and unselect some of the row 
      // in that case we are maintaing unchecked rows and we will ids of checked row , backend will duplicated or delete all rows except the unchecked we had passed to backend 
      const idx = this.selectedRows.findIndex(m => row.uuid == m.uuid)
      if (row.checked) {
        idx > -1 && this.selectedRows.splice(idx, 1)
      } else {
        idx == -1 && this.selectedRows.push(row)
      }
    } else {
      const idx = this.selectedRows.findIndex(m => row.uuid == m.uuid)
      if (row.checked) {
        idx == -1 && this.selectedRows.push(row)
      } else {
        idx > -1 && this.selectedRows.splice(idx, 1)
      }
    }
  }

  onHeaderCheckBoxChange(popover) {
    // if (event.target.checked) {
    if (this.isTrialUser) return;
    this.headerCheckBox = !this.headerCheckBox
    if (this.assets.length < this.totalAssets) {
      popover.open()
      // }
    } else {
      this.assets = this.assets.map((m) => { return { ...m, checked: this.headerCheckBox } })
      this.selectedRows = structuredClone(this.assets)
    }
  }

  checkRowsOfCurrentPageOnly() {
    this.isAllAssetSelected = false
    this.assets = this.assets.map((m) => { return { ...m, checked: true } })
    // this.selectedRows = structuredClone(this.assets)
    this.assets.forEach((item) => {
      const idx = this.selectedRows.findIndex(m => item.uuid == m.uuid)
      if (idx == -1) {
        this.selectedRows.push(item)
      }
    })
  }

  checkRowsOfAllPages() {
    this.isAllAssetSelected = true
    this.assets = this.assets.map((m) => { return { ...m, checked: true } })
    this.selectedRows = []
  }

  unSelectAll() {
    this.isAllAssetSelected = false
    this.assets = this.assets.map((m) => { return { ...m, checked: false, editRow: false, propertyTypes: [...this.propertyTypes] } })
    this.selectedRows = []
    this.rowAction = ''
    this.setStaticColumns()
  }

  rightclick(event, idx) {
    if (this.assets.findIndex(_ => _.checked) == -1) return;
    const row = document.getElementById(`api-data-table-${idx}`)
    let inputElem: any = row.children[0].children[0];
    if (this.selectedRows.length > 0 || this.isAllAssetSelected || inputElem.checked) {
      const element = document.getElementById("right_menu")
      element.style.top = `${row.offsetTop + 60}px`
      element.style.left = `60px`
      this.menu.open() //menu has both menus as viewchildren
    }
  }

  async onMenuItemSelection(item) {
    this.assets = this.assets.map((m) => { return { ...m, editRow: false } })
    this.rowAction = item.action
    switch (item.action) {
      case "edit":
        // edit select works for current page only , on pagination items are checked editable view is unset
        if (this.isAllAssetSelected) this.tempRows = structuredClone(this.assets)
        this.assets = this.assets.map((m) => {
          return {
            ...m,
            editRow: m.checked,
            disableTier2: !m.tier2List?.filter(m => m.name.length).length,
            disableTier3: !m.tier3List?.filter(m => m.name.length).length,
            disableTier4: !m.tier4List?.filter(m => m.name.length).length,
            tier2List: m.tier2List?.filter(m => m.name.length),
            tier3List: m.tier3List?.filter(m => m.name.length),
            tier4List: m.tier4List?.filter(m => m.name.length),

          }
        })
        this.setStaticColumns()
        return;
      case "duplicate":
        this.openModal(this.actionModalRef)
        return;
      case "delete":
        this.openModal(this.actionModalRef)
        return;
    }
  }

  confirm() {
    switch (this.rowAction) {
      case "edit":
        // this.assets = this.assets.map((m) => { return { ...m, editColumn: m.checkbox } })
        return;
      case "duplicate":
        this.duplicateRows()
        return;
      case "delete":
        this.deleteAsset()
        return;
    }
  }

  async deleteAsset() {
    try {
      const body = {
        'property_ids': Array.from(this.selectedRows, ({ uuid }) => uuid),
        all_properties: this.isAllAssetSelected,
        filters: this.filterformValues,
        tier_4: this.filters['tier_4']
      }
      const response = await this._dataManagerService.deleteProperty(body)
      this.closeModal()
      if (response['reset_tier1']) {
        //clear all filters // apply filter
        this.FiltersEvent.next({ type: DataManager.Events.fileUpload })
      }
      else if (response['reset_tier2']) {
        //clear tier 2 filters // apply filter
        this.FiltersEvent.next({ type: DataManager.Events.resetTier2 })
      }
      else if (response['reset_tier3']) {
        //clear tier 3 filters // apply filter
        this.FiltersEvent.next({ type: DataManager.Events.resetTier3 })

      }
      else if (response['reset_tier4']) {
        //clear tier 4 filters // apply filter
        this.FiltersEvent.next({ type: DataManager.Events.resetTier4 })

      }
      // if (this.assets.length == this.selectedRows.length) this.pageNumber--;  // if all properties from current page were deleted repage
      // if(this.page Math.ceil(this.totalAssets / this.rowsPerPage) > 1)
      this.selectedRows = []
      this.isAllAssetSelected = false
      this.pageNumber = 1;
      await this.getData()
      this.FiltersEvent.next({ type: DataManager.Events.crud })

      await this.getPropertyTypes()
      // this.FiltersEvent.next({ type: DataManager.Events.updateFiltersSection })
      this.toastr.success("Successfully deleted ")
    }
    catch (e) {
      if (e.status == 403) {
        this.toastr.error(e.error.detail)
        this.closeModal()
      } else this.toastr.error(e.error)
    }
  }

  async duplicateRows() {
    try {
      const body = {
        property_ids: Array.from(this.selectedRows, ({ uuid }) => uuid),
        all_properties: this.isAllAssetSelected,
      }
      await this._climatePriceService.duplicateRowsDataManagerAssets(body)
      this.selectedRows = []
      this.isAllAssetSelected = false
      await this.getData()
      this.FiltersEvent.next({ type: DataManager.Events.crud })
      this.closeModal()
      // this.FiltersEvent.next({ type: DataManager.Events.updateFiltersSection })
    } catch (e) { }
  }

  revertRowEdit(item, i) {
    if (item.uuid) {
      if (this.isAllAssetSelected) {
        const row = this.tempRows.find(x => x.uuid == this.assets[i].uuid)
        this.assets[i] = structuredClone({ ...row, checked: item.checked, editRow: false, propertyTypes: [...this.propertyTypes] })
      } else {
        const row = this.selectedRows.find(x => x.uuid == this.assets[i].uuid)
        this.assets[i] = structuredClone({ ...row, checked: item.checked, editRow: false, propertyTypes: [...this.propertyTypes] })
        // this.cancelEditableViewOfRow(item, i)
      }
      if (this.assets.findIndex(m => m.editRow) == -1) this.rowAction = ''
    } else {
      this.assets.shift()
      const newAssetIdx = this.assets.findIndex((m) => m.editRow)
      if (newAssetIdx == -1) {
        this.showCheckBoxColumn = true
        this.rowAction = ''
      }
    }
    this.setStaticColumns()
  }

  revertAllRowEdit = () => this.assets.forEach((item, idx) => { item.editRow && this.revertRowEdit(item, idx) })

  cancelEditableViewOfRow(item) {
    const idx = this.selectedRows.findIndex(x => x.uuid == item.uuid)
    this.selectedRows.splice(idx, 1)
    item.checked = false
    item.editRow = false
    if (!this.selectedRows.length) this.rowAction = '';
  }

  setStaticColumns() {
    let isNewAssetRowInTable = this.assets.findIndex(_ => !_.uuid) > -1
    if (this.assets.findIndex(item => item.checked) > -1 && this.rowAction == 'edit' && !isNewAssetRowInTable) {
      this.staticCols = {
        editColumn: '0px',
        checkBoxColumn: '48px',
        statusColumn: '86px'
      }
    } else if (isNewAssetRowInTable) {
      this.staticCols = {
        editColumn: '0px',
        checkBoxColumn: 'unset',
        statusColumn: '46px'
      }
    }
    else {
      this.staticCols = {
        editColumn: 'unset',
        checkBoxColumn: '0px',
        statusColumn: '38px'
      }
    }
  }

  addRow() {
    this.selectedRows = []
    this.assets = this.assets.map((m) => { return { ...m, editRow: m.uuid ? false : true, checked: false } })
    this.rowAction = this.menuItems[0].action
    this.showCheckBoxColumn = false
    let newRow = {
      "file": '',
      "portfolio_name": undefined,
      "portfolio": undefined,
      "address": "",
      "asset": "",
      "asset_class": "",
      "city": "",
      "country": "",
      "current_price": null,
      "year_acquired": null,
      "year_built": null,
      'zip_code': "",
      "latitude": null,
      "longitude": null,
      "property_name": "",
      "purchase_price": null,
      "state": "",
      "valuation": "",
      "disableTier2": true,
      "disableTier3": true,
      "disableTier4": true,
      "process_status": "",
      "isAdded": true,
      "country_formatted": "",
      "isvalid": false,
      "checked": false,
      "editRow": true,
      "uuid": undefined,
      "propertyTypes": [...this.propertyTypes]
    }
    this.assets.unshift(newRow)
    this.setStaticColumns()
  }

  validateRow = (p) => {
    let errorMessage = "";
    if (p.country_formatted.length === 0) {
      errorMessage = "Please Add Required Field: Country";
    }
    else if (p.city.length === 0) {
      errorMessage = "Please Add Required Field: City";
    }
    else if (p.asset.length === 0) {
      errorMessage = "Please Add Required Field: Property Type";
    }
    else if (p.address.length === 0) {
      errorMessage = "Please Add Required Field: Address";
    } else if (p.file == '') {
      errorMessage = "Please Add Required Field: Tier 1";
    }
    p.isvalid = errorMessage === "";
    return { isvalid: p.isvalid, errorMessage: errorMessage };
  };

  async save(i) {
    let row = this.assets[i]
    let validationResult = this.validateRow(row)
    if (!validationResult.isvalid) {
      this.toastr.error(validationResult.errorMessage)
    }
    else {
      try {
        const body = {
          "portfolio": row.file,
          "title": row.property_name,
          "asset_type": row.asset,
          "purchase_price": +row.purchase_price,
          "state": row.state,
          "address": row.address,
          "zip_code": row.zip_code,
          "city": row.city,
          "latitude": row.latitude,
          "longitude": row.longitude,
          "country": row.country_formatted,
          "year_acquired": row.year_acquired,
          "current_price": row.current_price,
          "year_built": row.year_built,
          "year_valuation": row.year_valuation,
          "valuation": row.valuation,
          "t2_id": row.tier_2_id || '',
          "t3_id": row.tier_3_id || '',
          "t4_id": row.tier_4 || ''
        }
        let response: any = await this._dataManagerService.addNewProperty(body)
        response.portfolio_name = response.portfolio_name
        this.assets[i] = response
        this.totalAssets = this.totalAssets + 1
        if (this.assets.findIndex(m => m.editRow) == -1) {
          this.showCheckBoxColumn = true
          this.rowAction = ''
        }
        this.FiltersEvent.next({ type: DataManager.Events.crud })
        this.setStaticColumns()
        this.toastr.success("Successfully Added " + row.address)
      } catch (e) {
        if (e.status == 422 || e.status == 500) {
          this.toastr.error(e.error.message)
        }
        else {
          let errors = AppConstants.processValidationErrors(e.error)
          for (let i = 0; i < errors.length; i++) {
            this.toastr.error(errors[i])
          }
        }
      }
    }
  }

  async update(row?) {
    try {

      const getBody = (data) => {
        let validation = this.validateRow(data)
        if (!validation.isvalid) {
          return { invalid: true, errorMsg: validation.errorMessage, ...data }
        }
        return {
          "property_id": data.uuid,
          "portfolio": data.file,
          "file": data.file,
          "title": data.property_name,
          "asset_class": data.asset,
          "uuid": data.uuid,
          "purchase_price": +data.purchase_price,
          "state": data.state,
          "address": data.address,
          "zip_code": data.zip_code,
          "city": data.city,
          "country": data.country_formatted,
          "year_acquired": +data.year_acquired,
          "current_price": +data.current_price,
          "year_built": +data.year_built,
          "valuation": +data.valuation, // making it int in case of ''
          "year_valuation": data.year_valuation || null,
          "t2_id": data.tier_2_id || '',
          "t3_id": data.tier_3_id || '',
          "tier_4": data.tier_4 || null
        }
      }
      const body = row ? [getBody(row)] : this.assets.filter(_ => _.checked).map((m) => { return { ...getBody(m) } })
      if (body.findIndex(_ => _.invalid) > -1) {
        let invalidRows = body.filter(_ => _.invalid)
        invalidRows.forEach((m) => {
          const idx = this.assets.findIndex(_ => _.uuid == m.uuid)
          this.toastr.error(row ? m.errorMsg : `Row # ${idx + 1} : ${m.errorMsg}`)
        })
      } else {
        const result: any = await this._dataManagerService.updateProperty(body)
        result.forEach((item) => {
          item.portfolio_name = item.portfolio_name
          let tier2List = this.tierOneList?.find((item) => item.uuid == item.file)?.children
          let tier3List = tier2List?.find((item) => item.uuid == item.tier_2_id)?.children
          let tier4List = tier3List?.find((item) => item.uuid == item.tier_3_id)?.children
          const idx = this.assets.findIndex(_ => _.uuid == item.uuid)
          this.assets[idx] = {
            ...item,
            file: item.file,
            checked: this.isAllAssetSelected ? this.selectedRows.findIndex(n => n.uuid == item.uuid) == -1 : false,
            editRow: false,
            disableTier2: item.tier_2_name == '',
            disableTier3: item.tier_3_name == '',
            disableTier4: item.tier_4_name == '',
            tier2List: tier2List,
            tier3List: tier3List,
            tier4List: tier4List,
          }
          this.cancelEditableViewOfRow(this.assets[idx])
        })
        this.FiltersEvent.next({ type: DataManager.Events.crud })
        this.setStaticColumns()
        row ? this.toastr.success("Successfully updated " + row.address) : this.toastr.success(`Successfully updated ${result.length} rows.`)
      }
    }
    catch (e) {
      this.toastr.error(e.error.detail)
    }
  }

  async fileuploaded() {
    try {
      await this.getTierOneList()
      await this.getData()
      this.FiltersEvent.next({ type: DataManager.Events.fileUpload })
    } catch (e) { }
  }

  async sortColumn(data) {
    this.selectedRows = []
    data.sortOrder = data.sortOrder == 'desc' ? "asc" : 'desc'
    this.sortOrder = data.sortOrder
    this.sortBy = data.sortBy
    await this.getData()
  }

  openModal(modal) {
    this.modalService.open(modal, {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title',
      scrollable: true,
      backdrop: 'static',
      centered: true
    })
  }

  closeModal() {
    this.modalService.dismissAll()
  }

  async updateTier1Lists(event) {
    this.tierOneList.splice(1, 0, event)
    this.tierOneList = [...this.tierOneList]
    this.assets[this.selectedRowIndex].file = event['uuid']
    await this.onTierOneSelection(this.assets[this.selectedRowIndex], event)
    this.FiltersEvent.next({ type: DataManager.Events.newPortfolio, data: { portfolio: event } })
  }

  // Tiers selection inside table
  async getTeir2({ uuid }) {
    let tierTwoList = await this._climatePriceService.getTier({ parent_id: uuid, tier_number: 2 })
    let tierTwoIdsList = Array.from(tierTwoList, ({ uuid }) => uuid)
    return {
      data: tierTwoList,
      uuids: tierTwoIdsList
    }
  }

  async getTeir3({ uuid }) {
    let tierThreeList = await this._climatePriceService.getTier({ parent_id: uuid, tier_number: 3 })
    let tierThreeIdsList = Array.from(tierThreeList, ({ uuid }) => uuid)
    return {
      data: tierThreeList,
      uuids: tierThreeIdsList
    }
  }

  async getTeir4({ uuid }) {
    let tierFourList = await this._climatePriceService.getTier({ parent_id: uuid, tier_number: 4 })
    // todo: why returning back the input uuid?
    let tierFourIdsList = Array.from(tierFourList, ({ uuid }) => uuid)
    return {
      data: tierFourList,
      uuids: tierFourIdsList
    }
  }

  // must call this method whenever select change tier1 or create new tier1
  async onTierOneSelection(item, event) {
    try {
      item.disableTier2 = false, item.disableTier3 = false, item.disableTier4 = false

      let teir2 = await this.getTeir2({ uuid: [event['uuid']] })
      item.tier_2_id = teir2.data[0].uuid
      item.tier2List = teir2.data.filter((m) => m.name.length)

      let teir3 = await this.getTeir3({ uuid: teir2.uuids })
      item.tier_3_id = teir3.data[0].uuid
      item.tier3List = teir3.data.filter((m) => m.name.length)

      let teir4 = await this.getTeir4({ uuid: teir3.uuids })
      item.tier_4 = teir4.data[0].uuid;
      item.tier4List = teir4.data.filter((m) => m.name.length)
    } catch (e) { }
  }


  async onTierTwoSelection(item) {
    try {
      let uuid = item.tier_2_id

      let teir3 = await this.getTeir3({ uuid: [uuid] })
      item.tier_3_id = teir3.data[0].uuid
      item.tier3List = teir3.data

      let teir4 = await this.getTeir4({ uuid: teir3.uuids })
      item.tier_4 = teir4.data[0].uuid;
      item.tier4List = teir4.data
    } catch (e) { }
  }

  async onTierThreeSelection(item) {
    try {
      let uuid = item.tier_3_id
      let teir4 = await this.getTeir4({ uuid: [uuid] })
      item.tier_4 = teir4.data[0].uuid;
      item.tier4List = teir4.data
    } catch (e) { }
  }

  onNgSelectOpen() {
    // hiding out all empty teirs , while mainting theirs ids in the list 
    setTimeout(() => {
      let elements = document.getElementsByClassName('ng-option')
      for (let i = 0; i < elements.length; i++) {
        if (!elements[i].children[0].innerHTML) {
          elements[i].setAttribute('style', 'display : none')
        }
      }
    })
  }

  navigate(item, column) {
    if (item.process_status != 'Processed') return;
    switch (column) {
      case 'Property Name':
        this._router.navigate([`/portfolio-analytics/single-asset/${item.uuid}`])
        break;
      case 'Tier 1':
        this._router.navigate([`/portfolio-analytics/multiple-assets`], { queryParams: { file: item.file } })
        break;
    }
  }

  createNewProperty(value) {
    if (!value.length) return this.toastr.error("Property type is required");
    this.assets[this.selectedRowIndex].propertyTypes.unshift(value)
    this.assets[this.selectedRowIndex].propertyTypes = [...this.assets[this.selectedRowIndex].propertyTypes]
    this.assets[this.selectedRowIndex].asset = value
    this.closeModal()
  }


  get showBulkOperationIcons() {
    const isAddNewAssetExistInTable = this.assets.findIndex(_ => !_.uuid) > -1
    const checkedRowsCount = this.assets.filter(_ => _.editRow).length
    const currentPageRowsSelectedOnly = this.selectedRows.findIndex(_ => !Array.from(this.assets, ({ uuid }) => uuid).includes(_.uuid)) == -1
    return checkedRowsCount > 1 && !isAddNewAssetExistInTable && !this.isAllAssetSelected && currentPageRowsSelectedOnly
  }

  onWheel(event: WheelEvent) {
    if (event.deltaX !== 0) {
      this.ngSelect['_results'].forEach(_ => _.close())
    }
  }

  ngOnDestroy() { }

}
