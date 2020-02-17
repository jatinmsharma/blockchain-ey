import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from './info';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerInfoServiceService {
  constructor(private http: HttpClient) { }
  configurl = '/api/info.json';
  getConfig(){
    return this.http.get<Config>(this.configurl);
    // console.log(this.configurl);
  }

}
