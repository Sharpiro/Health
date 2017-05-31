import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import { NutritionService } from "app/nutrition/nutrition.service";
import * as moment from 'moment';
import { NutritionHistory } from "app/nutrition/shared/dtos/nutrition-history";
import { MealEntry } from "app/nutrition/shared/dtos/mealEntry";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  public nutritionHistory: NutritionHistory;
  public mealEntries: MealEntry[];

  public historicalData: Chartist.IChartistData = {
    labels: [],
    series: [[]]
  };
  public mealEntryData: any = {
    labels: [],
    series: [[]]
  };
  public type = "Line";
  public options = {
    showLine: false,
    // low: 0
    axisX: {
      type: Chartist.FixedScaleAxis,
      divisor: 12,
      labelInterpolationFnc: function (value) {
        return moment(value).format('H:mm');
      }
    }
  };

  constructor(private nutritionService: NutritionService) { }

  ngOnInit() {
    this.updateDayHistoryChart();
    this.updateMealTimingChart();
  }

  public click() {
    const element = document.getElementById("testChart");
    console.log(element);
  }

  private updateDayHistoryChart(): void {
    this.nutritionService.getNutritionHistory().subscribe(nh => {
      this.nutritionHistory = nh;
      const labels = nh.days.map(d => `${moment(d.date).format("MM/DD")}: ${d.calories}`);
      const series = [
        nh.days.map(d => {
          return { meta: moment(d.date).format("MM/DD"), value: d.calories };
        })
      ];
      this.historicalData = { labels: labels, series: series };
    });
  }

  private updateMealTimingChart() {
    this.nutritionService.GetLatestMealEntries().subscribe(mealEntries => {
      this.mealEntries = mealEntries;
      // const labels = mealEntries.map(me => moment(me.timeStamp).format("H:mm"));
      const labels = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23
      ];
      // const series = [
      //   mealEntries.map(me => {
      //     return { meta: moment(me.timeStamp).format("MM/DD"), value: me.calories };
      //   })
      // ];
      const series = [
        {
          name: 'series-1',
          data: mealEntries.map(me => {
            return { x: moment(me.timeStamp).toDate(), y: me.calories };
          }),
          // data: [
          //   { x: new Date(143134652600), y: 53 },
          //   { x: new Date(143234652600), y: 40 },
          //   { x: new Date(143340052600), y: 45 },
          //   { x: new Date(143366652600), y: 40 },
          //   { x: new Date(143410652600), y: 20 },
          //   { x: new Date(143508652600), y: 32 },
          //   { x: new Date(143569652600), y: 18 },
          //   { x: new Date(143579652600), y: 11 }
          // ]
        }
      ];
      this.mealEntryData = { series: series };
    });
  }
}