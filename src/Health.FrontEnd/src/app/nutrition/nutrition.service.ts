import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class NutritionService {

  constructor(private http: Http) { }

  public getAllFoods(): Observable<any> {
    const url = "http://localhost:32159/api/food/getall";
    var observable = this.http.get(url).map((res, index) => res.json());
    return observable;
  }
}