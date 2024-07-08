import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-methodology",
  styleUrls: ["./methodology.component.scss"],
  templateUrl: "./methodology.component.html",
})
export class MethodologyComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  back() {
    this.router.navigate(["main"]);
  }
}
