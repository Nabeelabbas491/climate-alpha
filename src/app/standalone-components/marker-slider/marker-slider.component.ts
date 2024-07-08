import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelType, NgxSliderModule, Options } from '@angular-slider/ngx-slider';

interface SimpleSliderModel {
  options: Options;
}

@Component({
  selector: 'marker-slider',
  standalone: true,
  imports: [CommonModule, NgxSliderModule],
  templateUrl: './marker-slider.component.html',
  styleUrls: ['./marker-slider.component.scss']
})
export class MarkerSliderComponent implements OnChanges {

  @Input() sliderOptions: SliderConfig
  @Input() value: number;
  // chipLeft;
  config: SimpleSliderModel = {
    options: {
      floor: -30,
      ceil: 10,
      readOnly: true,
      tickStep: 5,
      ticksArray: [-30, -20, -10, 0, +10],
      showSelectionBar: true,
      showOuterSelectionBars: true,
      hideLimitLabels: true,
      getLegend: (value): string => {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '';
      },
      translate: (value: number, label: LabelType): string => {
        return ''
      },
    }
  };

  // reloading complete slider [ @Input() sliderOptions ] gets updated from parent component
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sliderOptions']) {
      this.sliderOptions && this.loadSlider()
    }
  }

  loadSlider() {
    this.config = {
      options: {
        floor: this.sliderOptions.ticks[0],
        ceil: this.sliderOptions.ticks[this.sliderOptions.ticks.length - 1],
        readOnly: true,
        tickStep: this.sliderOptions.ticks.length,
        ticksArray: this.sliderOptions.ticks,
        showSelectionBar: true,
        showOuterSelectionBars: true,
        hideLimitLabels: true,
        getLegend: (value): string => {
          return value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '%';
        },
        translate: (value: number, label: LabelType): string => {
          return ''
        },
      }
    };
    setTimeout(() => { this.setSliderUI() })
  }


  setSliderUI() {
    const elements = document.getElementById(this.sliderOptions?.id).getElementsByClassName("ngx-slider-span ngx-slider-pointer ngx-slider-pointer-min")

    if (elements.length) {
      elements[0].innerHTML = `<img class="slider-icon" src=${this.sliderOptions?.icon}>`
      if (this.sliderOptions?.label) {
        const ticksLegends = document.getElementById(this.sliderOptions?.id).getElementsByClassName("ngx-slider-span ngx-slider-tick-legend ng-star-inserted")
        for (let i = 0; i < ticksLegends.length; i++) {
          ticksLegends[i].innerHTML = ''
          const tick = `${this.sliderOptions?.ticks[i]}${this.sliderOptions?.tickUnit}`
          ticksLegends[i].innerHTML = tick
          ticksLegends[i].setAttribute('style', 'font-weight:400 !important')
          if (i == this.sliderOptions?.tickIndexForLabel) {
            ticksLegends[i].innerHTML = `${tick}<br><span class='slider-label'>${this.sliderOptions?.label}</span>`
            ticksLegends[i].setAttribute('style', 'font-weight:700 !important')
          } else if (i == 0 && this.sliderOptions?.ceilLabel?.length) {
            ticksLegends[i].innerHTML = `${tick}<br><span class='ciel-floor-label'>${this.sliderOptions?.ceilLabel}</span>`
          } else if (i == ticksLegends.length - 1 && this.sliderOptions?.floorLabel?.length) {
            ticksLegends[i].innerHTML = `${tick}<br><span class='ciel-floor-label'>${this.sliderOptions?.floorLabel}</span>`
          }
        }
      }
      // this.chipLeft = `${parseInt(window.getComputedStyle(elements[0]).getPropertyValue('left')) - 75}px`
    }
  }

}
export interface SliderConfig {
  ticks: number[]
  value?: number;
  id: string;
  icon: string;
  tickUnit?: string;
  label?: string;
  tickIndexForLabel?: number;
  labelClass?: string;
  ceilLabel?: string;
  floorLabel?: string;
}
