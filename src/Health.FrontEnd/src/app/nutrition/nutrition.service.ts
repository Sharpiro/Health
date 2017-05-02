import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { IFood } from "app/nutrition/shared/ifood";
import { Observer } from "rxjs/Observer";
// import { moment } from "moment";
import * as moment from 'moment';

@Injectable()
export class NutritionService {
  private baseUrl = "http://localhost:32159"
  // private allFoodsData: any;

  constructor(private http: Http) { }

  public getAllFoods(): Observable<IFood[]> {
    // if (this.allFoodsData) return Observable.create((observer) => observer.next(this.allFoodsData));
    const url = `${this.baseUrl}/api/food/getall`;
    var observable = this.http.get(url).map((res, index) => res.json());
    // observable.subscribe(value => this.allFoodsData = value);
    return observable;
  }

  public getallActiveFoods(): Observable<IFood[]> {
    const url = `${this.baseUrl}/api/food/getallactive`;
    var observable = this.http.get(url).map((res, index) => res.json()).publishReplay(1).refCount();;
    return observable;
  }

  public updateFood(food: IFood): Promise<Response> {
    const url = `${this.baseUrl}/api/food/Update`;
    var response = this.http.put(url, food).toPromise();
    return response;
  }

  public addDay(): Promise<Response> {
    const currentTime = moment().format('YYYY-MM-DDTHH:mm:ss');
    const url = `${this.baseUrl}/api/day/Add?currentTime=${currentTime}`;
    console.log(currentTime);
    // const currentTime = new Date();
    // const hours = currentTime.getHours();
    // currentTime.setHours(hours - 4);
    var response = this.http.post(url, {}).toPromise();
    return response;
  }
}