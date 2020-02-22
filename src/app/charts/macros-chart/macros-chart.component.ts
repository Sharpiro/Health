import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core'
import { Chart } from 'chart.js'
import { MealEntry } from '../../models/mealEntry'
import { FoodMap, FoodList } from '../../data/food-list'
import { Meal } from 'src/app/models/meal'

@Component({
  selector: 'app-macros-chart',
  templateUrl: './macros-chart.component.html',
  styleUrls: ['./macros-chart.component.css']
})
export class MacrosChartComponent implements AfterViewInit {
  // days: Day[]
  caloriesChart!: Chart

  @ViewChild('myChart', { static: true }) myChart!: ElementRef

  constructor() { }

  ngAfterViewInit(): void {
    const [foodShortNames, foodCalories] = this.initializeData()
    this.initializeChart(foodShortNames, foodCalories)
  }

  private initializeData(): [string[], number[]] {
    // todo: past day picker
    // const daysJson = localStorage.getItem("days")
    // this.days = daysJson ? JSON.parse(daysJson) : []
    // if (this.days.length < 1) {
    //   return [[], []]
    // }
    // const selectedDay = this.days[this.days.length - 1]

    const mealsJson = localStorage.getItem("meals")
    const meals: Meal[] = mealsJson ? JSON.parse(mealsJson) : []
    if (meals.length < 1) {
      return [[], []]
    }
    const allMealEntries = meals.reduce((prev, curr) => {
      return prev.concat(curr.mealEntries)
    }, [] as MealEntry[])

    let totalCarbs = 0
    let totalFiber = 0
    let totalFat = 0
    let totalProtein = 0
    for (const mealEntry of allMealEntries) {
      const food = FoodMap.get(mealEntry.foodName)
      if (!food) {
        throw new Error("food was not defined")
      }
      const servingsConsumed = mealEntry.calories / food.calories

      const carbsConsumed = food.carbs * servingsConsumed
      totalCarbs += carbsConsumed
      const fiberConsumed = food.fiber * servingsConsumed
      totalFiber += fiberConsumed
      const fatConsumed = food.fat * servingsConsumed
      totalFat += fatConsumed
      const proteinConsumed = food.protein * servingsConsumed
      totalProtein += proteinConsumed
    }

    return [
      ["Carbs", "Net Carbs", "Fat", "Protein"],
      [
        Math.round(totalCarbs),
        Math.round(totalCarbs - totalFiber),
        Math.round(totalFat),
        Math.round(totalProtein)
      ]
    ]
  }

  private initializeChart(labels: string[], data: number[]) {
    const canvas = this.myChart.nativeElement as HTMLCanvasElement
    this.caloriesChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Macros',
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
              max: 400
            }
          }],
        }
      }
    })
  }
}
