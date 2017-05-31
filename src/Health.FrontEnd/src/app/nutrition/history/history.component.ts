import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import { NutritionService } from "app/nutrition/nutrition.service";
import * as moment from 'moment';
import { NutritionHistory } from "app/nutrition/shared/dtos/nutrition-history";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  public nutritionHistory: NutritionHistory;
  public historicalData: Chartist.IChartistData = {
    labels: [],
    series: [[]]
  };
  public type = "Line";
  public options = {
    // low: 0
  };

  constructor(private nutritionService: NutritionService) { }

  ngOnInit() {
    this.updateChart();
  }

  public click() {
    const element = document.getElementById("testChart");
    console.log(element);
  }

  private updateChart(): void {
    this.nutritionService.getNutritionHistory().subscribe(nh => {
      this.nutritionHistory = nh;
      // const labels = nh.days.map(d => moment(d.date).format("MM/DD"));
      const labels = nh.days.map(d => `${moment(d.date).format("MM/DD")}: ${d.calories}`);
      const series = [
        nh.days.map(d => {
          return { meta: moment(d.date).format("MM/DD"), value: d.calories };
        })
      ];
      this.historicalData = { labels: labels, series: series };
    });
  }
}

