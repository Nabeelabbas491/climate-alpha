import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TierOne, Tier, TierHeadings } from 'app/climate-price/climate-price.interface';
import { AppConstants } from 'app/shared/data/constants';
import { ClimatePriceService } from 'app/shared/services/climate-price.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tiers-dropdowns',
  standalone: true,
  imports: [CommonModule, NgSelectModule, ReactiveFormsModule, FormsModule],
  templateUrl: './tiers-dropdowns.component.html',
  styleUrls: ['./tiers-dropdowns.component.scss', '../../climate-price/multiple-properties/asset-filters/asset-filters.component.scss']
})

export class TiersDropdownsComponent implements OnInit {

  @Output() FetchAssetsFilters = new EventEmitter<void>()
  @Output() ApplyFilter = new EventEmitter<void>()
  @Output() PatchValues = new EventEmitter()
  @Output() TotalAssetCount = new EventEmitter()
  @Output() isPortfolioUploaded = new EventEmitter()
  @Output() TierNamesChanged = new EventEmitter<TierHeadings>()
  @Input() form: FormGroup = new FormGroup({})
  @Input() tier1Class: string = 'col-md-3'
  @Input() tier2Class: string = 'col-md-3'
  @Input() tier3Class: string = 'col-md-3'
  @Input() tier4Class: string = 'col-md-3'
  @Input() showTier1: boolean = true
  @Input() showTier2: boolean = true
  @Input() showTier3: boolean = true
  @Input() showTier4: boolean = true
  @Input() showAllTiersOptions: boolean = true
  @Input() allowTiersHeadingsEdit: boolean = false
  editTier1: boolean = false
  editTier2: boolean = false
  editTier3: boolean = false
  editTier4: boolean = false
  tierOneList: TierOne[]
  tierTwoList: Tier[]
  tierThreeList: Tier[]
  tierFourList: Tier[]
  tierHeadings: TierHeadings = {
    tier1: '',
    tier2: '',
    tier3: '',
    tier4: '',
  };
  shareableLink: boolean = window.location.search.includes(AppConstants.Public_Link_Key);
  totalAssets: number;

  constructor(private _climatePriceService: ClimatePriceService, private _route: ActivatedRoute, private _toastr: ToastrService) { }

  async ngOnInit(): Promise<void> {
    await this.loadFilters()
  }

  async loadFilters(): Promise<void> {
    try {
      let response = await this._climatePriceService.getClientFiles()
      this.totalAssets = response['total_count']
      window.location.pathname.includes('multiple-assets') && this.TotalAssetCount.emit(this.totalAssets)
      this.tierOneList = response['data']
      this.tierOneList = this.tierOneList.filter(obj => obj['name'] !== '');

      if (!this.tierOneList.length) { this.isPortfolioUploaded.emit(false), this.disabeleTier1(), this.disbaleTier2(), this.disbaleTier3(), this.disbaleTier4() } else { this.isPortfolioUploaded.emit(true) }
      this.setTierHeadings()
      if (this.shareableLink) {
        this.form.disable();
        let response: any = await this._climatePriceService.getSavedFilters()
        response = JSON.parse(response), this.form.patchValue(response);
        await this.onTierOneSelection(this.form.value.selectedTierOne);
        this.ApplyFilter.next();
      } else {
        await this.onTierOneSelection(this.form.value.selectedTierOne)
      }
      // navigating from data manager asset table with selected file to multi asset 
      this._route.queryParams.subscribe(async (queryParams) => {
        if (Object.keys(queryParams).length && !this.shareableLink) {
          this.form.get('selectedTierOne').setValue(queryParams.file)
          await this.onTierOneSelection(this.form.value.selectedTierOne)
          this.ApplyFilter.next()
        }
      })
    } catch (e) { }
  }


  disableEnableTierDropdowns() {
    if (this.shareableLink) return;

    !this.tierOneList.length ? this.disabeleTier1() : this.enableTier1()
    !Array.from(this.tierTwoList, ({ name }) => name).filter(Boolean).length ? this.disbaleTier2() : this.enableTier2()
    !Array.from(this.tierThreeList, ({ name }) => name).filter(Boolean).length ? this.disbaleTier3() : this.enableTier3()
    !Array.from(this.tierFourList, ({ name }) => name).filter(Boolean).length ? this.disbaleTier4() : this.enableTier4()

  }

  enableTier1() {
    this.form.get('selectedTierOne')?.enable()
    this.form.get('selectedTierOne')?.setValue(this.form.value.selectedTierOne)
  }

  disabeleTier1() {
    this.form.get('selectedTierOne')?.disable()
    this.form.get('selectedTierOne')?.setValue('N/A')
  }

  enableTier2() {
    this.form.get('selectedTierTwo')?.enable()
    this.form.get('selectedTierTwo')?.setValue(this.form.value.selectedTierTwo)
  }

  disbaleTier2() {
    this.form.get('selectedTierTwo')?.disable()
    this.form.get('selectedTierTwo')?.setValue('N/A')
  }

  enableTier3() {
    this.form.get('selectedTierThree')?.enable()
    this.form.get('selectedTierThree')?.setValue(this.form.value.selectedTierThree)
  }

  disbaleTier3() {
    this.form.get('selectedTierThree')?.disable()
    this.form.get('selectedTierThree')?.setValue('N/A')
  }

  enableTier4() {
    this.form.get('selectedTierFour')?.enable()
    this.form.get('selectedTierFour')?.setValue(this.form.value.selectedTierFour)
  }

  disbaleTier4() {
    this.form.get('selectedTierFour')?.disable()
    this.form.get('selectedTierFour')?.setValue('N/A')
  }

  setTierHeadings(): void {
    if (this.tierOneList.length) this.tierHeadings = this.tierOneList[0]?.tier_headings
    this.checkAndSetDefaultTierHeadings()
  }

  checkAndSetDefaultTierHeadings() {
    this.tierHeadings.tier1 = this.tierHeadings.tier1 || ''
    this.tierHeadings.tier2 = this.tierHeadings.tier2 || ''
    this.tierHeadings.tier3 = this.tierHeadings.tier3 || ''
    this.tierHeadings.tier4 = this.tierHeadings.tier4 || ''
    this.allowTiersHeadingsEdit = this.tierHeadings.tier1.length || this.tierOneList.length ? true : false
  }

  async fetchTier({ selecedTierId, tierNumber, formKey, uuids }) {
    let body = Object.assign({ parent_id: uuids, tier_number: tierNumber })

    let response = await this._climatePriceService.getTier(body)
    let tierNumberIds = this.form.value[formKey] ? [this.form.value[formKey]] : Array.from(response, ({ uuid }) => uuid)

    let data = Object.assign({ data: response, uuids: tierNumberIds })

    return data
  }

  async onTierOneSelection(uuid: string) {
    try {
      /** uuid will be false in case of all option , and a string in case of selected value 
      *  passing array of all uuids in case of all option , and [selected uuid] in case of selected value
      */
      this.PatchValues.emit({ file: this.form.value.selectedTierOne })

      let ids = uuid ? [uuid] : Array.from(this.tierOneList, ({ uuid }) => uuid)

      let tier2 = await this.fetchTier({ selecedTierId: uuid, tierNumber: 2, formKey: 'selectedTierTwo', uuids: ids })
      this.tierTwoList = tier2.data

      let tier3 = await this.fetchTier({ selecedTierId: uuid, tierNumber: 3, formKey: 'selectedTierThree', uuids: tier2.uuids })
      this.tierThreeList = tier3.data

      let tier4 = await this.fetchTier({ selecedTierId: uuid, tierNumber: 4, formKey: 'selectedTierFour', uuids: tier3.uuids })
      this.tierFourList = tier4.data

      this.disableEnableTierDropdowns()

      this.FetchAssetsFilters.next()

    } catch (e) { }
  }

  async onTierTwoSelection(uuid: string) {
    try {
      /** uuid will be false in case of all option , and a string in case of selected value 
       *  passing array of all uuids in case of all option , and [selected uuid] in case of selected value
      */
      // this.disableApplyFilterBtn = true
      this.PatchValues.emit({ file: this.form.value.selectedTierOne, tier2: this.form.value.selectedTierTwo })
      let ids = uuid ? [uuid] : Array.from(this.tierTwoList, ({ uuid }) => uuid)

      let tier3 = await this.fetchTier({ selecedTierId: uuid, tierNumber: 3, formKey: 'selectedTierThree', uuids: ids })
      this.tierThreeList = tier3.data

      let tier4 = await this.fetchTier({ selecedTierId: uuid, tierNumber: 4, formKey: 'selectedTierFour', uuids: tier3.uuids })
      this.tierFourList = tier4.data

      this.disableEnableTierDropdowns()

      this.FetchAssetsFilters.next()

    } catch (e) { }
  }

  async onTierThreeSelection(uuid: string) {
    try {
      /** uuid will be false in case of all option , and a string in case of selected value 
      *  passing array of all uuids in case of all option , and [selected uuid] in case of selected value
      */
      // this.disableApplyFilterBtn = true
      this.PatchValues.emit({ file: this.form.value.selectedTierOne, tier2: this.form.value.selectedTierTwo, tier3: this.form.value.selectedTierThree })

      let ids = uuid ? [uuid] : Array.from(this.tierThreeList, ({ uuid }) => uuid)

      let tier4 = await this.fetchTier({ selecedTierId: uuid, tierNumber: 4, formKey: 'selectedTierFour', uuids: ids })
      this.tierFourList = tier4.data

      this.disableEnableTierDropdowns()

      this.FetchAssetsFilters.next()

    } catch (e) { }
  }

  onNgSelectOpen() {
    // hiding out all empty teirs , while mainting theirs ids in the list 
    setTimeout(() => {
      let elements = document.getElementsByClassName('ng-option')
      for (let i = 0; i < elements.length; i++) {
        if (!elements[i].children[0].children[0].innerHTML) {
          elements[i].setAttribute('style', 'display : none')
        }
      }
    })
  }

  onEditTierHeading(tierNumber) {
    this[`editTier${tierNumber}`] = true
    setTimeout(() => { document.getElementById(`tier${tierNumber}-heading`).focus() })
  }

  async onFocusOut(tierNumber) {
    try {
      const body = {
        tier1: this.tierHeadings.tier1,
        tier2: this.tierHeadings.tier2,
        tier3: this.tierHeadings.tier3,
        tier4: this.tierHeadings.tier4
      }
      await this._climatePriceService.updateTierHeadings(body)
      this[`editTier${tierNumber}`] = false
      this.checkAndSetDefaultTierHeadings()
      this.TierNamesChanged.emit(this.tierHeadings)
    } catch (e) { console.log(e) }
  }

  addNewTier1(portfolio) {
    this.tierOneList.unshift(portfolio)
    this.tierOneList = [...this.tierOneList]
    this.disableEnableTierDropdowns()
  }


}
