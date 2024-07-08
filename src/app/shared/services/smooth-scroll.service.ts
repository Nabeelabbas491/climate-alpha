import { Injectable } from "@angular/core";

@Injectable()
export class SmoothScrollService {
  section: any = "";
  constructor() {}

  setSection(title) {
    this.section = document.getElementById(title);
    this.section.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }

  getSection() {
    return this.section;
  }
}
