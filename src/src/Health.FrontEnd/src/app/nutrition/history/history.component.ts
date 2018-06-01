import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import { NutritionService } from "app/nutrition/nutrition.service";
import * as moment from 'moment';
import { NutritionHistory } from "app/nutrition/shared/dtos/nutrition-history";
import { MealEntry } from "app/nutrition/shared/dtos/mealEntry";
import { Day } from "app/nutrition/shared/dtos/day";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  public nutritionHistory: NutritionHistory;
  public mealEntries: MealEntry[];
  public days: Day[];
  public selectedDay: Day;
  public macros: any;

  public historicalData: Chartist.IChartistData = {
    labels: [],
    series: [[]]
  };
  public mealEntryData: any = {
    labels: [],
    series: [[]]
  };

  public macrosData: any = {
    labels: [" "],
    series: [1]
  };

  public lineChartTypeName = "Line";
  public pieChartTypeName = "Pie";
  public options = {
    showLine: false,
    axisX: {
      type: Chartist.FixedScaleAxis,
      divisor: 8,
      labelInterpolationFnc: function (value) {
        return moment(value).format('H:mm');
      }
    }
  };

  constructor(private nutritionService: NutritionService) { }

  ngOnInit() {
    this.getDayList();
    this.updateDayHistoryChart();
    this.updateMealTimingChart();
    this.updateMacrosChart();
  }

  public mealTimingDateChanged(event: Day) {
    console.log(event);
    const momentDate = moment(event.date);
    this.updateMealTimingChart(momentDate);
  }

  private getDayList(numberOfDays = 10): void {
    this.nutritionService.getDayList(numberOfDays).subscribe(days => {
      this.days = days;
      if (days && days.length > 0)
        this.selectedDay = days[0];
    });
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

  private updateMealTimingChart(date?: moment.Moment) {
    this.nutritionService.GetMacroTiming(date).subscribe(obj => {
      this.mealEntries = obj;
      const series = [
        {
          name: 'series-1',
          data: obj.carbsList.map(me => {
            return { x: moment(me.timeStamp).toDate(), y: me.calories };
          })
        },
        {
          name: 'series-2',
          data: obj.fatList.map(me => {
            return { x: moment(me.timeStamp).toDate(), y: me.calories };
          })
        },
        {
          name: 'series-3',
          data: obj.proteinList.map(me => {
            return { x: moment(me.timeStamp).toDate(), y: me.calories };
          })
        }
      ];
      this.mealEntryData = { series: series };
    });
  }

  private updateMacrosChart() {
    this.nutritionService.getMacros().subscribe(macros => {
      if (macros.carbs === 0 && macros.protein === 0 && macros.fat === 0) return;
      const totalMacros = macros.carbs + macros.protein + macros.fat;
      const labels = [
        `Carbs: ${Math.round(macros.carbs / totalMacros * 100)}% - ${macros.carbs}g`,
        `Protein: ${Math.round(macros.protein / totalMacros * 100)}% - ${macros.protein}g`,
        `Fat: ${Math.round(macros.fat / totalMacros * 100)}% - ${macros.fat}g`];
      const series = [macros.carbs, macros.protein, macros.fat];
      this.macrosData = { labels: labels, series: series };
    });
  }
}