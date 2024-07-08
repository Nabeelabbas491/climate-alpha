import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlphaFinderService } from 'app/shared/services/alpha-finder.service';
import { ToastrService } from 'ngx-toastr';
import { Country } from '../alpha-finder.interface';
import { AlphaFinderConstants } from '../alpha-finder.constants';
import { AuthService } from 'app/shared/services/auth.service';
import { AppConstants } from 'app/shared/data/constants';
import { Role } from 'app/shared/data/roles';

@Component({
  selector: 'app-save-selected-feature-search',
  templateUrl: './save-selected-feature-search.component.html',
  styleUrls: ['./save-selected-feature-search.component.scss']
})
export class SaveSelectedFeatureSearchComponent implements OnInit {

  searchName = ''
  searchDescription = ''
  categories = []
  selectedSavedFeature = undefined
  country: Country;
  visible_to_all: boolean = false
  showCheckBox: boolean = false

  constructor(private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private _authService: AuthService,
    private alphaFinderService: AlphaFinderService) {
    let slug = route.snapshot.paramMap.get("country")
    this.country = AlphaFinderConstants.countries[slug]
    let user = this._authService.admin
    // show checkbox only if email is from utils list and country is canada
    this.showCheckBox = user.roles.includes(Role.ROLES.SUPER_ADMIN) && this.country.path === AlphaFinderConstants.countries.ca.path
  }

  ngOnInit(): void {
    this.getSelectedData()
  }

  getSelectedData() {
    let data = this.alphaFinderService.getItem();
    if (data.hasOwnProperty('selectedSavedSearch')) {
      this.categories = data.categories;
      this.selectedSavedFeature = data.selectedSavedSearch;
    } else {
      this.categories = data;
    }
  }


  handleNavigation(path) {
    let data = !this.selectedSavedFeature ? this.categories : { data: this.selectedSavedFeature, editSearch: true }
    this.alphaFinderService.setItem(data)
    this.router.navigate([`${path}${this.country.path}`])
  }

  async onSave() {
    try {
      if (!this.searchName.length) return
      let uuids = []
      this.categories.forEach((category) => {
        category.sub_categories.forEach((subCategory) => {
          uuids.push(subCategory.uuid)
        })
      })
      let data = Object.assign({ title: this.searchName, description: this.searchDescription, features: uuids, country: this.country.value, visible_to_all: this.visible_to_all })
      await this.alphaFinderService.saveSelectedFeatures(data)
      this.router.navigate([`/alpha-finder/load-search/${this.country.path}`]);
      return this.toastr.success("Your selected features are saved! You can use your saved features to search alpha directly next time.");
    } catch (e) { }
  }

  deleteSubCategory(index, subIndex) {
    this.categories[index].sub_categories.splice(subIndex, 1)
    this.categories[index].selectedSubCatgeoriesCount--;
    this.categories[index].sub_categories.length == 0 && this.categories.splice(index, 1)
    if (this.categories.length == 0) this.router.navigate(['/alpha-finder/dashboard'])
  }

}

