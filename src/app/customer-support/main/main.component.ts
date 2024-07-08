import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  url: string;
  constructor(public sanitizer: DomSanitizer) {
    this.url = ('https://support.alphageo.ai/knowledge');
  }

  ngOnInit(): void {
    window.open(this.url)
  }

}
