import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlphaFinderService } from 'app/shared/services/alpha-finder.service';
import * as cloneDeep from "lodash/cloneDeep";
import { AlphaFinderConstants } from '../alpha-finder.constants';
import { Country } from '../alpha-finder.interface';
import { AuthService } from 'app/shared/services/auth.service';

@Component({
  selector: 'app-user-saved-searches',
  templateUrl: './user-saved-searches.component.html',
  styleUrls: ['./user-saved-searches.component.scss']
})
export class UserSavedSearchesComponent implements OnInit {

  featureIcon = '../../../assets/img/svg/Features.svg'
  savedFeaturesList: any = []
  clonedList: any = []
  searchId = null;
  country: Country;
  user: Object;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private alphaFinderService: AlphaFinderService,
    private _authService: AuthService) {
    let slug = route.snapshot.paramMap.get("country")
    this.country = AlphaFinderConstants.countries[slug]
    this.user = this._authService.admin
  }

  ngOnInit(): void {
    this.getFeatures()
  }

  async getFeatures() {
    try {
      this.savedFeaturesList = await this.alphaFinderService.getSavedFeatures({ country: this.country.value })
      this.clonedList = cloneDeep(this.savedFeaturesList)
    } catch (e) { }
  }

  handleNavigation(path, item) {
    let data = { data: item, editSearch: true }
    this.alphaFinderService.setItem(data)
    this.router.navigate([`${path}${this.country.path}`])
  }

  async deleteFeature(fearure, index) {
    try {
      let response = await this.alphaFinderService.deleteSavedFeature(fearure.id, this.country.value)
      this.savedFeaturesList.splice(index, 1)
      this.clonedList.splice(index, 1)
      !this.savedFeaturesList.length && this.router.navigate(['/alpha-finder/dashboard'])
    } catch (e) { }
  }

  async findAlpha() {
    let search = this.savedFeaturesList.find((m) => m.id == this.searchId)
    let allFeatures: any = await this.alphaFinderService.getAlphaFinderCategories({ country: this.country.value })

    search.saved_features.forEach((feature) => {
      let index = allFeatures.findIndex(el => el.uuid === feature.parent)
      let subCategoryIndex = allFeatures[index].sub_categories.findIndex(el => el.uuid === feature.uuid)
      allFeatures[index].sub_categories[subCategoryIndex].applyClass = 'feature-box-checked'
      allFeatures[index].sub_categories[subCategoryIndex].isSelected = true
    })

    let data = []
    allFeatures.forEach((category) => {
      data.push({
        ...category, sub_categories: category.sub_categories.filter((subCategory) => { return subCategory.isSelected })
      })
    })

    data = data.map((m) => {
      return { ...m, selectedSubCatgeoriesCount: m.sub_categories.length }
    })

    data = data.filter((m) => { return m.sub_categories.length })
    this.alphaFinderService.setItem(data)
    this.router.navigate([`/alpha-finder/alpha-search/${this.country.path}`])
  }

  search(value) {
    if (value.length) {
      this.savedFeaturesList = this.clonedList.filter((m) => { return m.title.toLowerCase().includes(value.toLowerCase()) })
    } else {
      this.savedFeaturesList = cloneDeep(this.clonedList)
    }
  }

}
