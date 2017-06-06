import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { IFood } from "app/nutrition/shared/dtos/ifood";
import { Observer } from "rxjs/Observer";
import * as moment from 'moment';
import { Day } from "app/nutrition/shared/dtos//day";
import { ActivityLevel } from "app/shared/enums/activity-level.enum";
import { Gender } from "app/shared/enums/gender.enum";
import { NutritionHistory } from "app/nutrition/shared/dtos/nutrition-history";
import { MealEntry } from "app/nutrition/shared/dtos/mealEntry";
import { Macros } from "app/nutrition/shared/dtos/macros";

@Injectable()
export class NutritionService {
  // private baseUrl = "http://localhost:32159";
  private baseUrl = "";
  private allFoodsData: IFood[];

  constructor(private http: Http) { }

  public getAllFoods(): Observable<IFood[]> {
    if (this.allFoodsData) return Observable.of(this.allFoodsData);
    const url = `${this.baseUrl}/api/food/getall`;
    const observable = this.getMappedObservable(this.http.get(url)).share();
    observable.subscribe(foods => this.allFoodsData = foods);
    return observable;
  }

  public getallActiveFoods(): Observable<IFood[]> {
    const url = `${this.baseUrl}/api/food/getallactive`;
    const observable = this.getMappedObservable(this.http.get(url));
    return observable;
  }

  public getMacros(): Observable<Macros> {
    const url = `${this.baseUrl}/api/Day/getMacros`;
    const observable = this.getMappedObservable(this.http.get(url));
    return observable;
  }

  public getNutritionHistory(): Observable<NutritionHistory> {
    const currentTime = moment().format('YYYY-MM-DDTHH:mm:ss');
    const url = `${this.baseUrl}/api/NutritionMetrics/GetNutritionHistory?date=${currentTime}`;
    const observable = this.getMappedObservable(this.http.get(url));
    return observable;
  }

  public updateFood(food: IFood): Observable<IFood[]> {
    const url = `${this.baseUrl}/api/food/Update`;
    const observable = this.getMappedObservable(this.http.put(url, food));
    return observable;
  }

  public addDay(): Observable<Day> {
    const currentTime = moment().format('YYYY-MM-DDTHH:mm:ss');
    const url = `${this.baseUrl}/api/day/Add?currentTime=${currentTime}`;
    const observable = this.getMappedObservable(this.http.post(url, {}));
    return observable;
  }

  public getLatestDay(): Observable<Day> {
    const url = `${this.baseUrl}/api/day/getlatest`;
    const observable = this.getMappedObservable(this.http.get(url));
    return observable;
  }

  public getLatestMealEntries(date?: moment.Moment | null): Observable<MealEntry[]> {
    let currentTime: string | null = null;
    if (date)
      currentTime = date.format('YYYY-MM-DDTHH:mm:ss');
    const url = `${this.baseUrl}/api/day/GetLatestMealEntries?dayTimeStamp=${currentTime}`;
    const observable = this.getMappedObservable(this.http.get(url));
    return observable;
  }

  public getDayList(numberOfDays: number): Observable<Day[]> {
    const url = `${this.baseUrl}/api/day/GetDayList?numberOfDays=${numberOfDays}`;
    const observable = this.getMappedObservable(this.http.get(url));
    return observable;
  }

  public updateDay(day: Day): Observable<Day> {
    const url = `${this.baseUrl}/api/day/Update`;
    const observable = this.getMappedObservable(this.http.put(url, day));
    return observable;
  }

  public clearDay(): Observable<Day> {
    const url = `${this.baseUrl}/api/day/Clear`;
    const observable = this.getMappedObservable(this.http.put(url, {}));
    return observable;
  }

  public pruneDays(): Observable<any> {
    const url = `${this.baseUrl}/api/day/PruneInvalidDays`;
    const observable = this.http.put(url, {}).catch((err, obs) => Observable.throw(JSON.parse(err._body)));
    return observable;
  }

  public getMaintenanceCalories(age: number, gender: Gender, heightInInches: number, weightInPounds: number,
    activityLevel: ActivityLevel): number {
    const kiloConversion = 0.45359237;
    const centiMeterConversion = 2.54;
    const genderError = gender === Gender.Female ? -161 : gender === Gender.Male ? 5 : 9000;
    const kilograms = weightInPounds * kiloConversion;
    const centimeters = heightInInches * centiMeterConversion;
    let activityBoost;

    switch (activityLevel) {
      case ActivityLevel.BasalMetabolicRate:
        activityBoost = 1;
        break;
      case ActivityLevel.Sedentary:
        activityBoost = 1.2;
        break;
      case ActivityLevel.LightlyActive:
        activityBoost = 1.375;
        break;
      case ActivityLevel.ModeratelyActive:
        activityBoost = 1.55;
        break;
      case ActivityLevel.VeryActive:
        activityBoost = 1.725;
        break;
      case ActivityLevel.ExtraActive:
        activityBoost = 1.9;
        break;
      default:
        throw new Error("Invalid Activity level provided");
    }
    const bmr = (10 * kilograms) + (6.25 * centimeters) - (5 * age) + genderError;
    const maintenance = Math.round(bmr * activityBoost);
    return maintenance;
  }

  private getMappedObservable(observable: Observable<Response>) {
    return observable.map((res, index) => res.json())
      .catch((err, obs) => Observable.throw(JSON.parse(err._body)));
  }
}