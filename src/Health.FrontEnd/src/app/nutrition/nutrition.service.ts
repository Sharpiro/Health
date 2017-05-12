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
    var observable = this.getMappedObservable(this.http.get(url)).share();
    observable.subscribe(foods => this.allFoodsData = foods);
    return observable;
  }

  public getallActiveFoods(): Observable<IFood[]> {
    const url = `${this.baseUrl}/api/food/getallactive`;
    var observable = this.getMappedObservable(this.http.get(url));
    return observable;
  }

  public updateFood(food: IFood): Observable<IFood[]> {
    const url = `${this.baseUrl}/api/food/Update`;
    var observable = this.getMappedObservable(this.http.put(url, food));
    return observable;
  }

  public addDay(): Observable<Day> {
    const currentTime = moment().format('YYYY-MM-DDTHH:mm:ss');
    const url = `${this.baseUrl}/api/day/Add?currentTime=${currentTime}`;
    var observable = this.getMappedObservable(this.http.post(url, {}));
    return observable;
  }

  public getLatestDay(): Observable<Day> {
    const url = `${this.baseUrl}/api/day/getlatest`;
    var observable = this.getMappedObservable(this.http.get(url));
    return observable;
  }

  public updateDay(day: Day): Observable<Day> {
    const url = `${this.baseUrl}/api/day/Update`;
    var observable = this.getMappedObservable(this.http.put(url, day));
    return observable;
  }

  public clearDay(): Observable<Day> {
    const url = `${this.baseUrl}/api/day/Clear`;
    var observable = this.getMappedObservable(this.http.put(url, {}));
    return observable;
  }

  private getMappedObservable(observable: Observable<Response>) {
    return observable.map((res, index) => res.json())
      .catch((err, observable) => Observable.throw(JSON.parse(err._body)));
  }
}