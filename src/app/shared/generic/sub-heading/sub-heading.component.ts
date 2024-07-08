import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-sub-heading",
  styleUrls: ["sub-heading.component.scss"],
  templateUrl: "sub-heading.component.html",
})
export class SubHeadingComponent implements OnInit {
  constructor() {}

  @Input() subHeading: any;
  @Input() fontSizeClass = "font-small-3";
  ngOnInit() {}
}
