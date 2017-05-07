import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { IFood } from "app/nutrition/shared/dtos/ifood";
import { Observer } from "rxjs/Observer";
import * as moment from 'moment';
import { Day } from "app/nutrition/shared/dtos//day";

@Injectable()
export class NutritionService {
  private baseUrl = "http://localhost:32159"
  private allFoodsData: IFood[];

  constructor(private http: Http) { }

  public getAllFoods(): Observable<IFood[]> {
    if (this.allFoodsData) return Observable.of(this.allFoodsData);
    const url = `${this.baseUrl}/api/food/getall`;
    var observable: Observable<IFood[]> = this.http.get(url).map((res) => res.json())
      .share();
    observable.subscribe(foods => this.allFoodsData = foods);
    return observable;
  }

  public getallActiveFoods(): Observable<IFood[]> {
    const url = `${this.baseUrl}/api/food/getallactive`;
    var observable = this.http.get(url).map((res, index) => res.json())
    return observable;
  }

  public updateFood(food: IFood): Promise<Response> {
    const url = `${this.baseUrl}/api/food/Update`;
    var response = this.http.put(url, food).toPromise();
    return response;
  }

  public addDay(): Observable<Day> {
    const currentTime = moment().format('YYYY-MM-DDTHH:mm:ss');
    const url = `${this.baseUrl}/api/day/Add?currentTime=${currentTime}`;
    var response = this.http.post(url, {}).map((res, index) => res.json());
    return response;
  }

  public getLatestDay(): Observable<Day> {
    const url = `${this.baseUrl}/api/day/getlatest`;
    var observable = this.http.get(url).map((res, index) => res.json());
    return observable;
  }

  public updateDay(day: Day): Observable<Day> {
    const url = `${this.baseUrl}/api/day/Update`;
    var response = this.http.put(url, day).map((res, index) => res.json());
    return response;
  }

  public clearDay(): Observable<Day> {
    const url = `${this.baseUrl}/api/day/Clear`;
    var response = this.http.put(url, {}).map((res, index) => res.json());
    return response;
  }
}