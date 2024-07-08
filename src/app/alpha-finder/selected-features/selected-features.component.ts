import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as cloneDeep from "lodash/cloneDeep";
import { Country } from '../alpha-finder.interface';

@Component({
  selector: 'app-selected-features',
  templateUrl: './selected-features.component.html',
  styleUrls: ['./selected-features.component.scss']
})
export class SelectedFeaturesComponent implements OnInit {

  @Output() updateDataEvent = new EventEmitter();
  country: Country
  showResult = true
  features = []

  constructor(private route: ActivatedRoute) {
    this.country = this.route.snapshot.data.country
  }

  ngOnInit(): void { }

  updateData(data) {
    data.showResult = !data.showResult
    let list = cloneDeep(this.features)
    list = list.map((item) => {
      return { ...item, sub_categories: item.sub_categories.filter((m) => m.showResult) }
    })
    this.updateDataEvent.next(list)
  }

}
