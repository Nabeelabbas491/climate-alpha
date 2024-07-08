import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Chart } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { environment } from 'environments/environment';
import { AppConstants } from './shared/data/constants';
import { SessionService } from './shared/services/session.service';
import { NonceService } from './shared/services/nonce.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {

    subscription$: Subscription = new Subscription();

    nonceID: string = '';
    constructor(private router: Router, private sessionService: SessionService, private nonceService: NonceService) {
        Chart.plugins.unregister(ChartDataLabels);
    }

    async ngOnInit() {
        this.nonceID = this.nonceService.getNonce();
        this.subscription$.add(this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd)
            )
            .subscribe(() => window.scrollTo(0, 0))
        );
        this.firePublicLinkOptions()
        this.setPublicLinkParams()
    }

    // for synchronous execution of javascript code. Any Guards shoud be executed after below function is executed fully.
    firePublicLinkOptions() {
        if (window.location.search.includes(AppConstants.Public_Link_Key)) {
            // if user exist in local storage , dont open the public link , rather navigate to that link with normal flow
            if (localStorage.getItem('admin')) {
                this.router.navigate([window.location.pathname], {})
                return
            };
            // making a synchronous api call
            let url = new URL(window.location.href)
            var request = new XMLHttpRequest();
            request.open('GET', `${environment.BACKEND_URL}shareable_link/verify`, false);  // `false` 
            request.setRequestHeader('Authorization', 'Token ' + url.searchParams.get(AppConstants.Public_Link_Key));
            request.send();
            localStorage.setItem("public-token", url.searchParams.get(AppConstants.Public_Link_Key))
            if (request.status == 401) {
                this.router.navigate(['link-expired'])
            }
        } else {
            localStorage.getItem('public-token') && localStorage.removeItem('public-token')
        }
    }

    // setting params '?gVm=TokenVlaue' with every url for public link 
    setPublicLinkParams() {
        this.subscription$.add(
            this.router.events.subscribe((response) => {
                if (response instanceof NavigationEnd) {
                    if (localStorage.getItem('public-token')) {
                        let url = window.location.protocol + "//" + window.location.host + window.location.pathname
                        window.history.replaceState(null, null, `${url}?${AppConstants.Public_Link_Key}=${localStorage.getItem('public-token')}`);
                    }
                }
            })
        )
    }

    ngOnDestroy() {
        if (this.subscription$) {
            this.subscription$.unsubscribe();
        }
    }
}