import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { environment } from "../../../environments/environment";
import { AuthService } from "./auth.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable()
export class ApiService {

  private baseURL: String;

  constructor(private http: HttpClient, private auth: AuthService) {
    this.baseURL = environment.BACKEND_URL;
  }

  getOptions() {
    let token = localStorage.getItem('public-token') ? localStorage.getItem('public-token') : this.auth.getToken()
    const headers = new HttpHeaders().set("Authorization", "Token " + token);
    return headers;
  }

  get(subURL): Observable<any> {
    return this.http.get(this.baseURL + subURL, { headers: this.getOptions() });
  }

  put(subURL, body = {}): Observable<any> {
    return this.http.put(this.baseURL + subURL, body, { headers: this.getOptions() });
  }

  patch(subURL, body = {}): Observable<any> {
    return this.http.patch(this.baseURL + subURL, body, { headers: this.getOptions() });
  }

  post(subURL, body = {}): Observable<any> {
    return this.http.post(this.baseURL + subURL, body, { headers: this.getOptions() });
  }

  delete(subURL): Observable<any> {
    return this.http.delete(this.baseURL + subURL, { headers: this.getOptions() });
  }

  deleteWithBody(subURL, body): Observable<any> {
    return this.http.delete(this.baseURL + subURL, { headers: this.getOptions(), body: body });
  }
}
