import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { AppConstants } from 'app/shared/data/constants';
import * as Chart from 'chart.js';
import * as ChartAnnotation from "chartjs-plugin-annotation";
import { SingleIndicator } from '../location-analytics.interface';
import { BehaviorSubject, Subscription } from 'rxjs';
import { IndexConstants } from 'app/index/index-constants';
import { LocationAnalytic } from '../location-analytic.utils';

@Component({
  selector: 'app-location-analytic-modal',
  templateUrl: './location-analytic-modal.component.html',
  styleUrls: ['./location-analytic-modal.component.scss'],
})
export class LocationAnalyticModalComponent implements OnInit {

  // tooltipHoverObs$ = new BehaviorSubject<any>(undefined);
  // isLineGraph: boolean = true
  graph: any;
  showModal: boolean = false
  data;
  colors = {
    1: '#009999',
    2: '#EAAE14',
    3: '#B5B5B5',
    4: '#106767',
    5: '#EA8814',
    6: '#616161',
  }
  colorCount: number = null;
  // subscription$: any;

  constructor(private _cdr: ChangeDetectorRef) {
    // this.subscription$ = new Subscription();
  }

  ngOnInit(): void {
    // this.setTooltipContent()
  }

  openModal(row) {
    this.data = row
    this.colorCount = 0;
    // const row = event.data
    // this.data = { ...row.value, key: row.key, }
    for (let key in this.data.locations) {
      if (this.colorCount > 6) this.colorCount = 0;
      this.colorCount++;
      this.data.locations[key].color = this.colors[this.colorCount]
      // this.data.selectedLocations[key]['graphLineColor'] = this.colors[this.colorCount]
    }
    this.showModal = true
    this._cdr.detectChanges()
    AppConstants.showBackDropShadow()
    this.loadBarGraph()
  }

  closeModal() {
    AppConstants.hideBackDropShadow()
    this.showModal = false
  }

  setTooltipContent() {
    // this.subscription$.add(this.tooltipHoverObs$.subscribe((year) => {
    //   if (year) {
    //     this.data = Object.assign(this.data)
    //     let tooltip = Object.assign({ year: null, data: [] })
    //     tooltip.year = year
    //     for (let key in this.data.selectedLocations) {
    //       const data = this.data.selectedLocations[key].allYearsData.find(m => m.year == year)
    //       const color = this.data.selectedLocations[key].graphLineColor
    //       tooltip.data.length < Object.keys(this.data.selectedLocations).length && tooltip.data.push({ ...data, color: color, id: key })
    //     }
    //     const tooltipEl = document.getElementById('custom-tooltip');
    //     let tooltipStr = `<div>Year : ${tooltip.year}</div>`
    //     tooltip.data.forEach((m) => {
    //       const tooltipItem = `
    //        <div class="d-flex align-items-center">
    //        <div class="tooltip-box" style="background-color : ${m.color};width: 12px;height: 12px;display: block;border-radius: 2px;"></div>
    //        <div class="pl-1 value">${m.score ? m.score.toFixed(2) : 'N/A'}</div>
    //        </div> 
    //        `
    //       tooltipStr = tooltipStr + tooltipItem
    //     })
    //     tooltipEl.innerHTML = tooltipStr
    //   }
    // }))
  }

  // graph background colors (red,yellow,green) and vertical black line annotations
  getBoxAnnotations = () => {
    const green = 'rgba(75, 192, 192, 0.2)', yellow = 'rgba(255, 205, 86, 0.2)', red = 'rgb(255 148 148 / 20%)';
    const middleBoxStart = 40, middleBoxEnd = 70

    let annotations;
    if (this.data.type == 'resilience') {
      annotations = {
        "red": { start: null, end: middleBoxStart, color: red },
        "yellow": { start: middleBoxStart, end: middleBoxEnd, color: yellow },
        "green": { start: middleBoxEnd, end: null, color: green },
      }
    } else {
      annotations = {
        "green": { start: null, end: middleBoxStart, color: green },
        "yellow": { start: middleBoxStart, end: middleBoxEnd, color: yellow },
        "red": { start: middleBoxEnd, end: null, color: red },
      }
    }

    const redBox = {
      drawTime: "beforeDatasetsDraw",
      type: "box",
      mode: "horizontal",
      xScaleID: "x-axis-0",
      yScaleID: "y-axis-0",
      yMin: annotations.red.start,
      yMax: annotations.red.end,
      borderWidth: 1,
      backgroundColor: annotations.red.color,
      // borderColor: "yellow",
    }

    const greenBox = {
      drawTime: "beforeDatasetsDraw",
      type: "box",
      mode: "horizontal",
      xScaleID: "x-axis-0",
      yScaleID: "y-axis-0",
      yMin: annotations.green.start,
      yMax: annotations.green.end,
      borderWidth: 1,
      backgroundColor: annotations.green.color,
      // borderColor: "yellow",
    }

    const yellowBox = {
      drawTime: "beforeDatasetsDraw",
      type: "box",
      mode: "horizontal",
      xScaleID: "x-axis-0",
      yScaleID: "y-axis-0",
      yMin: annotations.yellow.start,
      yMax: annotations.yellow.end,
      borderWidth: 1,
      backgroundColor: annotations.yellow.color,
      // borderColor: "yellow",
    }

    const VerticalLine = {
      drawTime: "beforeDatasetsDraw",
      // drawTime: 'afterDatasetsDraw',
      adjustScaleRange: true,
      type: "line",
      borderWidth: 1,
      mode: "vertical",
      scaleID: "x-axis-0",
      value: null,
      endValue: null,
      borderColor: "black",
    }

    const annotationsList: Array<{ [key: string]: string | null | boolean | number | Object | unknown }> = [redBox, greenBox, yellowBox]
    // this.isLineGraph && annotationsList.push(VerticalLine)

    return {
      annotations: annotationsList
    }
  }

  drawChart() {
    // this.graph && this.graph.destroy()
    // this.isLineGraph ? this.loadLineGraph() : this.loadBarGraph()
  }

  //bar graph region
  loadBarGraph() {

    let yValues = [], xValues = [], colors = [];

    for (let latLng in this.data.locations) {
      // const scoreType = this.data.locations[key].hasOwnProperty(IndexConstants.Score_Keys.Impact.key) ? this.data.selectedScoreType : IndexConstants.Score_Keys.Score.key
      if (this.data.locations[latLng].value != LocationAnalytic.notAvailable) {
        yValues.push(this.data.locations[latLng].value)
        xValues.push(this.data.locations[latLng].locationData.name)
        colors.push(this.data.locations[latLng].color)
      }
    }

    if (xValues.length > 2) xValues = xValues.map(_ => _.split(","))

    // let locations = Object.values(this.data.selectedLocations).filter(_ => _.value)
    // const yValues = Array.from(locations, ({ value }) => value)
    const dataSet = [
      {
        label: `HPI`,
        tooltip_label: `Baseline Index`,
        data: yValues,
        barThickness: '60',
        backgroundColor: colors,
        borderWidth: 0
      }
    ]

    // let labels = []
    // if (Array.from(locations, ({ name }) => name).length < 4) {
    //   labels = Array.from(locations, ({ name }) => name)
    // } else {
    //   Array.from(locations, ({ name }) => name).forEach((item) => { labels.push(item?.split(",")) })
    // }

    const config = {
      dataSet: dataSet,
      xAxisLables: xValues,
      yAxisMin: 0,
      yAxisMax: 100,
      annotations: this.getBoxAnnotations()
    }
    this.plotBarGraph(config)
  }

  plotBarGraph(config) {
    this.graph = new Chart('graphId', {
      type: 'bar',
      data: {
        labels: config.xAxisLables,
        datasets: config.dataSet
      },
      options: {
        // responsive: true,
        // aspectRatio: 2.5,
        maintainAspectRatio: false,
        tooltips: {
          enabled: false
        },
        legend: { display: false },
        scales: {
          yAxes: [{
            ticks: {
              suggestedMin: config.yAxisMin,
              suggestedMax: config.yAxisMax
            },
            scaleLabel: {
              display: true,
              fontSize: 12,
              // fontFamily: "'Montserrat', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'",
            },
          }],
          xAxis: [{
            scaleLabel: {
              display: true,
              fontSize: 12,
              // fontFamily: "'Montserrat', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'",
            },
          }]
        },
        annotation: config.annotations
      } as any,
      plugins: [ChartAnnotation],
    });
  }

  // line graph Region
  loadLineGraph() {
    // // each location has data for different years (some has data for 2 years while some has data for 10 years), so getting a largest list for maximum years for x-axis values
    // // let maxYearsList = [];
    // // for (let key in this.data.selectedLocations) {
    // //   if (this.data.selectedLocations[key].allYearsData.length > maxYearsList.length) {
    // //     maxYearsList = this.data.selectedLocations[key].allYearsData
    // //   }
    // // }
    // let everyLocationAllYearsList = Array.from(Object.values(this.data.selectedLocations), ({ allYearsData }) => allYearsData).flat().filter(Boolean)
    // let xValues = Array.from(everyLocationAllYearsList, ({ year }) => year);
    // xValues = [...new Set(xValues)].sort((a, b) => (a > b ? 1 : -1));

    // let dataSet = []
    // for (let key in this.data.selectedLocations) {
    //   const location = this.data.selectedLocations[key]
    //   const yValues = xValues.map((m) => { return location?.allYearsData.find(_ => _.year == m)?.score })
    //   const graphLine = {
    //     ...location,
    //     // label: ,
    //     // tooltip_label: `Baseline Index`,
    //     data: yValues,
    //     // borderDash: [10, 5],
    //     pointRadius: 3,
    //     // pointStyle: 'rectRounded' as 'rectRounded',
    //     lineTension: 0,
    //     borderColor: location.graphLineColor,
    //     backgroundColor: location.graphLineColor,
    //     fill: false,
    //     borderWidth: 2
    //   }
    //   dataSet.push(graphLine)
    // }

    // // let points = Array.from(dataSet, ({ data }) => data).flat()
    // // let yAxisMin = Math.min.apply(Math, points), yAxisMax = Math.max.apply(Math, points);
    // const config = {
    //   dataSet: dataSet,
    //   xAxisLables: xValues,
    //   yAxisMin: 0,
    //   yAxisMax: 100,
    //   annotations: this.getBoxAnnotations()
    // }

    // this.plotLineGraph(config)
  }

  plotLineGraph(config) {
    // var self = this
    // this.graph = new Chart('graphId', {
    //   type: 'line',
    //   data: {
    //     labels: config.xAxisLables,
    //     datasets: config.dataSet
    //   },
    //   options: {
    //     // responsive: true,
    //     // aspectRatio: 2.8,
    //     maintainAspectRatio: false,
    //     tooltips: {
    //       // Disable the on-canvas tooltip
    //       enabled: false,
    //       intersect: false,
    //       mode: "x-axis",
    //       custom: function (tooltipModel) {

    //         const tooltipEl = document.getElementById('custom-tooltip');
    //         if (!tooltipEl) { return }

    //         // Set caret Position
    //         tooltipEl.classList.remove('above', 'below', 'no-transform');

    //         if (tooltipModel.yAlign) {
    //           tooltipEl.classList.add(tooltipModel.yAlign);
    //         } else {
    //           tooltipEl.classList.add('no-transform');
    //         }


    //         if (tooltipModel.opacity === 0) {
    //           tooltipEl.style.display = 'none';
    //           return;
    //         } else {
    //           tooltipEl.style.display = 'revert';
    //         }

    //         // minus pixels add to tooltip postion based on number of lines for adjusment
    //         const tooltip = {
    //           1: 80,
    //           2: 90,
    //           3: 100,
    //           4: 110,
    //           5: 120,
    //           6: 130
    //         }

    //         // styling a tooltip
    //         var position = this._chart.canvas.getBoundingClientRect();
    //         tooltipEl.style.opacity = '1';
    //         tooltipEl.style.zIndex = '9'
    //         tooltipEl.style.color = 'black'
    //         tooltipEl.style.background = '#fff'
    //         tooltipEl.style.border = '0.5px solid #8d857b'
    //         tooltipEl.style.borderRadius = '4px'
    //         tooltipEl.style.position = 'absolute';
    //         tooltipEl.style.left = (position.left + window.pageXOffset + tooltipModel.caretX + 20) + 'px';
    //         tooltipEl.style.top = (position.top + window.pageYOffset + tooltipModel.caretY - tooltip[6]) + 'px';
    //         tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
    //         tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
    //         tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
    //         tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
    //         tooltipEl.style.pointerEvents = 'none';
    //         tooltipEl.innerHTML = tooltipEl.innerHTML

    //         // vertical line on hover
    //         const year = parseInt(tooltipModel?.dataPoints[0]?.label)
    //         self.tooltipHoverObs$.next(year)
    //         self.graph.options.annotation.annotations[3].value = year
    //         self.graph.options.annotation.annotations[3].endValue = year
    //         self.graph.update(0);

    //       },
    //     },
    //     legend: { display: false },
    //     scales: {
    //       yAxes: [{
    //         ticks: {
    //           suggestedMin: config.yAxisMin,
    //           suggestedMax: config.yAxisMax
    //         },
    //         scaleLabel: {
    //           display: true,
    //           fontSize: 12,
    //           fontFamily: "'Montserrat', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'",
    //         },
    //       }],
    //       xAxis: [{
    //         scaleLabel: {
    //           display: true,
    //           fontSize: 12,
    //           fontFamily: "'Montserrat', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'",
    //         },
    //       }]
    //     },
    //     annotation: config.annotations
    //   } as any,
    //   plugins: [ChartAnnotation],
    // });
  }

  mouseOut() {
    // if (!this.isLineGraph) return;
    // this.graph.options.annotation.annotations[3].value = null
    // this.graph.options.annotation.annotations[3].endValue = null
    // this.graph.update(0);
    // document.getElementById("custom-tooltip").style.display = 'none'
  }

  returnZero() { return 0 }

  ngOnDestroy() {
    // this.subscription$?.unsubscribe();
  }

}

