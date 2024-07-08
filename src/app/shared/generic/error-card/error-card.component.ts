import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-card',
  templateUrl: './error-card.component.html',
  styleUrls: ['./error-card.component.scss']
})
export class ErrorCardComponent implements OnInit {

  @Input() message = 'Your data is being processed. Please check back again later for a response.';

  constructor() { }

  ngOnInit(): void {
  }

}
  