import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
    selector: 'app-error-page',
    templateUrl: './error-page.component.html',
    styleUrls: ['./error-page.component.scss']
})

export class ErrorPageComponent {

    title: string = '404 - Page Not Found!'
    description: string = ''

    constructor(private _route: ActivatedRoute) {
        this.title = _route.snapshot.data.message
        this.description = _route.snapshot.data.description
    }
}