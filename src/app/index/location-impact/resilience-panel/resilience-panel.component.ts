import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-resilience-panel',
  templateUrl: './resilience-panel.component.html',
  styleUrls: ['./resilience-panel.component.scss']
})
export class ResiliencePanelComponent {

  scenarios = ["LOW", "MED", "HIGH"]
  selectedDict;

  data = [
    {
      indicator: 'Energy Generation',
      list: [
        { title: 'Renewable Power', desc: 'Percentage of energy from renewable sources' },
        { title: 'Per Capita Emissions', desc: 'Total greenhouse gas (GHG) emissions per capita' }
      ]
    },
    {
      indicator: 'Social Robustness',
      list: [
        { title: 'Vulnerable Population', desc: 'Percentage of population over age 65' },
        { title: 'Poverty Rate', desc: 'Percentage of population below the poverty line' },
        { title: 'Inequality (Gini Coefficient)', desc: 'Income inequality (Gini coefficient)' },
        { title: 'Household Debt', desc: 'Household debt-to-income-ratio' },
        { title: 'Education Attainment', desc: 'Percentage of population with a bachelors degree or above' },
        { title: 'Unemployment Rate', desc: 'Unemployed percentage of the population' },
        { title: 'Crime Rate', desc: 'Number of violent crimes per capita' },
        { title: 'Life Expectancy', desc: 'Average life expectancy' },
        { title: 'Insurance Coverage', desc: 'Percentage of population with health insurance (public or private)' },
      ]
    },
    {
      indicator: 'Economic Momentum',
      list: [
        { title: 'Household Income', desc: 'Annual median household income' },
        { title: 'Income Growth', desc: 'Annualized growth rate in median income per capita' },
        { title: 'Gross National Income (GNI)', desc: 'Gross National Income (1km radius)' },
        { title: 'Municipal Bond Rating', desc: 'Municipal bond rating' }
      ]
    },
    {
      indicator: 'Infrastructure Quality',
      list: [
        { title: 'Fixed Capital Formation', desc: 'Fixed capital formation ratio (FCFR)' },
        { title: 'Transport Node Density', desc: 'Transportation node density' }
      ]
    },
    {
      indicator: 'Environmental Wellness',
      list: [
        { title: 'Air Quality', desc: 'Air Quality Index (AQI)' },
        { title: 'Water Quality', desc: 'Drinking water quality' }
      ]
    },
    {
      indicator: 'Governance Effectiveness',
      list: [
        { title: 'Government Efficiency', desc: 'Government efficiency rating' },
        { title: 'Public Service Quality', desc: 'Quality of public service delivery' },
        { title: 'Public Spending', desc: 'Total public spending per capita' },
        { title: 'Internet Speed', desc: 'Internet speed' },
        { title: 'AI Readiness', desc: 'Readiness to adopt AI across government, business and society' },
      ]
    },
  ]

  constructor() {
    this.selectedDict = this.data.find(m => m.indicator == 'Social Robustness')
  }



}
