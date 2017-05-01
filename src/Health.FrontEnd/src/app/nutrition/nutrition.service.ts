import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { IFood } from "app/nutrition/shared/ifood";

@Injectable()
export class NutritionService {
  private baseUrl = "http://localhost:32159"

  constructor(private http: Http) { }

  public getAllFoods(): Observable<IFood[]> {
    const url = `http://localhost:32159/api/food/getall`;
    var observable = this.http.get(url).map((res, index) => res.json());
    return observable;
  }

  public updateFood(food: IFood): Promise<Response> {
    const url = `http://localhost:32159/api/food/Update`;
    var response = this.http.put(url, food).toPromise();
    return response;
  }
}