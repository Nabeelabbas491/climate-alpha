import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { environment } from "../../../environments/environment";
import { AuthService } from "./auth.service";
@Injectable()
export class DownloadService {
  private baseURL: String;

  constructor(private http: HttpClient, private auth: AuthService) {
    this.baseURL = environment.BACKEND_URL;
  }

  getOptions() {
    let token = this.auth.getToken();
    let headers = new HttpHeaders().set("Authorization", "Token " + token);
    headers = headers.set("Accept", "text/csv");
    return headers;
  }

  get(subURL, responseType = 'text'): Observable<any> {
    const requestOptions: Object = {
      headers: this.getOptions(),
      observe: 'response',
      responseType: responseType
    };
    return this.http.get(this.baseURL + subURL, requestOptions);
  }


  post(subURL, body): Observable<any> {
    const requestOptions: Object = {
      /* other options here */
      headers: this.getOptions(),
      observe: 'response',
      responseType: 'blob'
    };
    return this.http.post(this.baseURL + subURL, body, requestOptions);
  }
}

@Injectable()
export class DownloadPDF {
  private baseURL: string;

  constructor(private http: HttpClient, private auth: AuthService) {
    this.baseURL = environment.PDF_SERVICE_URL;
  }

  post(subURL, body): Observable<any> {
    const requestOptions: Object = {
      /* other options here */
      observe: 'response', responseType: 'blob'
    };
    return this.http.post(this.baseURL + subURL, body, requestOptions);
  }
}