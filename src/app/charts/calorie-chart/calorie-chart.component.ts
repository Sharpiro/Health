import { Component, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js';
import { Day } from '../../models/day';
import { MealEntry } from '../../models/mealEntry';
import { FoodMap } from '../../data/food-list';

@Component({
  selector: 'app-calorie-chart',
  templateUrl: './calorie-chart.component.html',
  styleUrls: ['./calorie-chart.component.css']
})
export class CalorieChartComponent implements AfterViewInit {
  days: Day[]
  caloriesChart: Chart
  
  constructor() { }

  ngAfterViewInit(): void {
    const { foodShortNames, foodCalories } = this.initializeCaloriesData()
    this.initializeCaloriesChart(foodShortNames, foodCalories)
  }

  private initializeCaloriesData(): { foodShortNames: string[], foodCalories: number[] } {
    const daysJson = localStorage.getItem("days")
    this.days = daysJson ? JSON.parse(daysJson) : []
    if (this.days.length < 1) {
      return { foodShortNames: [], foodCalories: [] }
    }

    const mostRecentDay = this.days[this.days.length - 1]
    const allMealEntries = mostRecentDay.meals.reduce((prev, curr) => {
      return prev.concat(curr.mealEntries)
    }, [] as MealEntry[])
    const foodCalorieMap = allMealEntries.reduce((map, curr) => {
      if (map.get(curr.foodName) === undefined) {
        return map.set(curr.foodName, curr.calories)
      }
      return map.set(curr.foodName, map.get(curr.foodName) + curr.calories)
    }, new Map<string, number>())
    const foodNames = Array.from(foodCalorieMap.keys())
    const foodShortNames = foodNames.map(f => FoodMap.get(f).shortName)
    const foodCalories = Array.from(foodCalorieMap.values())
    return { foodShortNames, foodCalories }
  }

  private initializeCaloriesChart(labels: string[], data: number[]) {
    const ctx = document.getElementById("myChart") as HTMLCanvasElement;
    this.caloriesChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Calories',
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',

            'rgba(99, 64, 182, 0.2)',
            'rgba(113, 225, 135, 0.2)',
            'rgba(225, 75, 36, 0.2)',
            'rgba(94, 88, 152, 0.2)',
            'rgba(12, 203, 122, 0.2)',
            'rgba(198, 224, 255, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',

            'rgba(99, 64, 182, 0.2)',
            'rgba(113, 225, 135, 0.2)',
            'rgba(225, 75, 36, 0.2)',
            'rgba(94, 88, 152, 0.2)',
            'rgba(12, 203, 122, 0.2)',
            'rgba(198, 224, 255, 0.2)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              max: 1000
            }
          }],
        }
      }
    })
  }
}
