import { HttpClient, HttpEventType, HttpResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-disclaimer",
  styleUrls: ["./disclaimer.component.scss"],
  templateUrl: "./disclaimer.component.html",
})
export class DisclaimerComponent implements OnInit {

  public form: FormGroup;
  constructor(private router: Router) {
  }

  ngOnInit() { }

  back() {
    // this.router.navigate(["main"]);
  }

}
