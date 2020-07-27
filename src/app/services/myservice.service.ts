import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';


@Injectable()
export class MyserviceService {
  serviceproperty = "Service Created";
  constructor(private http: HttpClient) { }

   public getJSON(): Observable<any> {
      return this.http.get("./assets/data.json");
   }

}

