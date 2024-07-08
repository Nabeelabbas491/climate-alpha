import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AlphaFinderService } from 'app/shared/services/alpha-finder.service';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { Country } from '../alpha-finder.interface';

@Component({
  selector: 'app-alpha-finder-main',
  templateUrl: './alpha-finder-main.component.html',
  styleUrls: ['./alpha-finder-main.component.scss']
})
export class AlphaFinderMainComponent implements OnInit {

  selectedFeatureItem = ''
  saveIcon = '../../../assets/img/svg/Save.svg'
  loadIcon = '../../../assets/img/svg/Load.svg'
  inputValue = ''
  isSavedSearchEdit = false
  allCategories: any = []
  searchedCategories: any = []
  showSearchedItemBox = false
  savedSearch = []
  selectedSearchedUuid = null
  searchIcon = '../../../assets/img/svg/search.svg'
  dropdownValue = undefined;
  country: Country;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private alphaFinderService: AlphaFinderService) {
    this.country = this.route.snapshot.data.country
  }

  ngOnInit(): void {
    this.getData()
  }

  async getData() {
    try {
      this.allCategories = await this.alphaFinderService.getAlphaFinderCategories({ country: this.country.value })
      this.selectedFeatureItem = this.allCategories[0].title
      this.allCategories = this.allCategories.map((category) => {
        return {
          ...category,
          selectedSubCatgeoriesCount: 0,
          sub_categories: category.sub_categories.map((subCategory) => { return { ...subCategory, isSearched: false, isSelected: false, applyClass: 'feature-box-default' } })
        }
      })
      this.setDropDownListing()
      this.getSelectedData()
    } catch (e) { }
  }

  setDropDownListing() {
    this.allCategories.forEach((category) => {
      category.sub_categories.forEach((subCategory) => {
        this.searchedCategories.push({
          ...subCategory,
          category: category.title,
        })
      })
    })
    this.searchedCategories = this.searchedCategories.map((m) => {
      return { ...m, label: `${m.category}: ${m.title}` }
    })
  }

  scrollIntoView(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  onSubCategorySelection(subCategory) {
    subCategory.isSelected = !subCategory.isSelected
    subCategory.applyClass = subCategory.isSelected ? 'feature-box-checked' : 'feature-box-default';
    let index = this.allCategories.findIndex(el => el.uuid === subCategory.parent)
    subCategory.isSelected ? this.allCategories[index].selectedSubCatgeoriesCount++ : this.allCategories[index].selectedSubCatgeoriesCount--;
    this.dropdownValue = undefined
  }

  onUnSelectAll() {
    this.allCategories = this.allCategories.map((category) => {
      return {
        ...category,
        selectedSubCatgeoriesCount: 0,
        sub_categories: category.sub_categories.map((subCtegory) => { return { ...subCtegory, isSelected: false, applyClass: 'feature-box-default' } })
      }
    })
    this.router.navigate([`/alpha-finder/dashboard/${this.country.path}`])
  }


  onSelection(item) {
    this.allCategories = this.allCategories.map((category) => {
      return {
        ...category,
        sub_categories: category.sub_categories.map((m) => { return { ...m, applyClass: m.uuid == item.uuid ? 'feature-box-searched' : m.isSelected ? 'feature-box-checked' : 'feature-box-default' } })
      }
    })
    if (item.category !== this.selectedFeatureItem) { this.selectedFeatureItem = item.category }
    this.scrollIntoView(item.uuid)
  }

  backspace() {
    this.allCategories = this.allCategories.map((category) => {
      return {
        ...category,
        sub_categories: category.sub_categories.map((m) => { return { ...m, applyClass: m.isSelected ? 'feature-box-checked' : 'feature-box-default' } })
      }
    })
  }

  handleNavigation(path) {
    if (!this.checkFeatureSelected()) return this.toastr.error("Please select a feature first!");
    let data = []
    this.allCategories.forEach((category) => {
      data.push({
        ...category, sub_categories: category.sub_categories.filter((subCategory) => { return subCategory.isSelected })
      })
    })
    data = data.filter((m) => { return m.sub_categories.length })
    this.alphaFinderService.setItem(data)
    this.router.navigate([`${path}${this.country.path}`])
  }

  onSaveAsNewSearch() {
    if (!this.checkFeatureSelected()) return this.toastr.error("Please select a feature first!");
    let data = []
    this.allCategories.forEach((category) => {
      data.push({
        ...category, sub_categories: category.sub_categories.filter((subCategory) => { return subCategory.isSelected })
      })
    })
    data = data.filter((m) => { return m.sub_categories.length })
    let selectedFeatures = Object.assign({ categories: data, selectedSavedSearch: this.savedSearch })
    this.alphaFinderService.setItem(selectedFeatures)
    this.router.navigate([`/alpha-finder/save-search/${this.country.path}`])
  }

  async updateSavedSearch() {
    try {
      let uuids = []
      this.allCategories.forEach((category) => {
        category.sub_categories.forEach((subCategory) => {
          subCategory.isSelected && uuids.push(subCategory.uuid)
        })
      })
      if (!uuids.length) return this.toastr.error("Please select a feature!");
      let data = Object.assign({ title: this.savedSearch['title'], description: this.savedSearch['description'], features: uuids, country: this.country.value })
      await this.alphaFinderService.updateSelectedFeatures(data, this.savedSearch['id'])
      this.router.navigate([`/alpha-finder/load-search/${this.country.path}`]);
      return this.toastr.success("Search Updated successfully!");
    } catch (e) { }
  }

  getSelectedData() {
    let data = this.alphaFinderService.getItem()
    data.editSearch ? this.editSavedFeature(data) : this.mapSelectedFeaturesOnAllFeatures(data)
  }

  mapSelectedFeaturesOnAllFeatures(data) {
    if (!data) return;
    data.forEach((category) => {
      let index = this.allCategories.findIndex(el => el.uuid === category.uuid)
      this.allCategories[index].selectedSubCatgeoriesCount = category.selectedSubCatgeoriesCount
      category.sub_categories.forEach((item) => {
        this.allCategories[index].sub_categories.forEach((m) => {
          if (m.uuid === item.uuid) {
            m.applyClass = item.applyClass
            m.isSelected = item.isSelected
            m.isSearched = item.isSearched
          }
        })
      })
    })
    this.allCategories = this.allCategories
  }

  editSavedFeature(response) {
    if (!response) return
    this.isSavedSearchEdit = response.editSearch
    this.savedSearch = response.data
    this.savedSearch['saved_features'].forEach((feature) => {
      let index = this.allCategories.findIndex(el => el.uuid === feature.parent)
      let subCategoryIndex = this.allCategories[index].sub_categories.findIndex(el => el.uuid === feature.uuid)
      this.allCategories[index].sub_categories[subCategoryIndex].applyClass = 'feature-box-checked'
      this.allCategories[index].sub_categories[subCategoryIndex].isSelected = true
      this.allCategories[index].selectedSubCatgeoriesCount++;
    })
  }

  async loadSearch() {
    try {
      let response: any = await this.alphaFinderService.getSavedFeatures({ country: this.country.value })
      if (response.length) {
        this.alphaFinderService.removeItem()
        this.router.navigate([`/alpha-finder/load-search/${this.country.path}`])
      } else {
        this.toastr.error("Please save a search first")
      }

    } catch (e) { }
  }

  checkFeatureSelected() {
    let isFeatureSelected = false
    this.allCategories.forEach((category) => {
      category.sub_categories.forEach((subCategory) => {
        if (subCategory.isSelected) {
          isFeatureSelected = true
        }
      })
    })
    return isFeatureSelected
  }

  getYearTooltip(year) {
    if (year.includes('-')) {
      return 'Aggregated data from the year-range.'
    } else {
      return 'The year of the latest data entry.'
    }
  }

  deleteSelectedFeatures(path) {
    this.alphaFinderService.removeItem()
    this.router.navigate([`${path}${this.country.path}`])
  }

}



