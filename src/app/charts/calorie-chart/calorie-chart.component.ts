import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core'
import { Chart } from 'chart.js'
import { MealEntry } from '../../models/mealEntry'
import { FoodMap } from '../../data/food-list'
import { Meal } from 'src/app/models/meal'

@Component({
  selector: 'app-calorie-chart',
  templateUrl: './calorie-chart.component.html',
  styleUrls: ['./calorie-chart.component.css']
})
export class CalorieChartComponent implements AfterViewInit {
  caloriesChart!: Chart

  @ViewChild('myChart', { static: true }) myChart!: ElementRef

  constructor() { }

  ngAfterViewInit(): void {
    const [foodShortNames, foodCalories] = this.initializeCaloriesData()
    this.initializeCaloriesChart(foodShortNames, foodCalories)
  }

  private initializeCaloriesData(): [string[], number[]] {
    const mealsJson = localStorage.getItem("meals")
    const meals: Meal[] = mealsJson ? JSON.parse(mealsJson) : []
    if (meals.length < 1) {
      return [[], []]
    }
    const allMealEntries = meals.reduce((prev, curr) => {
      return prev.concat(curr.mealEntries)
    }, [] as MealEntry[])
    const foodDailyCalories = allMealEntries.reduce((map, curr) => {
      const dailyCalories = map.get(curr.foodName)
      if (dailyCalories === undefined) {
        return map.set(curr.foodName, curr.calories)
      }
      return map.set(curr.foodName, dailyCalories + curr.calories)
    }, new Map<string, number>())
    const foodNames = Array.from(foodDailyCalories.keys())
    // todo: can we do better than asserting the value?
    const foodShortNames = foodNames.map(f => FoodMap.get(f)!.shortName)
    const foodCalories = Array.from(foodDailyCalories.values())

    // todo: group duplicate short-names and aggregate the calories
    return [foodShortNames, foodCalories]
  }

  private initializeCaloriesChart(labels: string[], data: number[]) {
    const canvas = this.myChart.nativeElement as HTMLCanvasElement
    this.caloriesChart = new Chart(canvas, {
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
