import { Component, OnInit, LOCALE_ID, Inject } from '@angular/core'
import { Meal } from '../models/meal'
import { MatDialog, MatSnackBar } from '@angular/material'
import { ConfirmationComponentComponent } from '../confirmation-component/confirmation-component.component'
import { Day } from '../models/day'
import { formatDate } from '@angular/common'
import { MealEntry } from '../models/mealEntry'

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.css']
})
export class MealsComponent implements OnInit {
  meals!: Meal[]
  days!: Day[]
  mealsTree!: object
  daysTree!: object
  mealInProgress = false

  constructor(private dialog: MatDialog, @Inject(LOCALE_ID) private locale: string,
    public snackBar: MatSnackBar) { }

  ngOnInit() {
    const daysJson = localStorage.getItem("days")
    this.days = daysJson ? JSON.parse(daysJson) : []
    this.daysTree = this.buildDaysTree(this.days.slice().reverse())

    const mealsJson = localStorage.getItem("meals")
    this.meals = mealsJson ? JSON.parse(mealsJson) : []
    this.mealsTree = this.buildMealsTree(this.meals)

    const mealEntriesJson = localStorage.getItem("mealEntries")
    const mealEntries: MealEntry[] = mealEntriesJson ? JSON.parse(mealEntriesJson) : []
    this.mealInProgress = mealEntries.length > 0
  }

  buildMealsTree(meals: Meal[]): any {
    const mealTree: any = {}
    for (let i = 0; i < meals.length; i++) {
      const meal = meals[i]
      const mealKey = `Meal ${i + 1}: ${meal.calories}`
      mealTree[mealKey] = {}
      for (let j = 0; j < meal.mealEntries.length; j++) {
        const mealEntry = meal.mealEntries[j]
        mealTree[mealKey][`Entry ${j + 1}: ${mealEntry.foodName}`] = mealEntry.calories
      }
    }
    return mealTree
  }

  buildDaysTree(days: Day[]): any {
    const dayTree: any = {}
    for (let i = 0; i < days.length; i++) {
      const day = days[i]
      const dateFormatted = formatDate(day.timestamp, "EEEE, MMMM d", this.locale)
      const dayKey = `${dateFormatted}: ${day.calories}`
      dayTree[dayKey] = this.buildMealsTree(day.meals)
    }
    return dayTree
  }

  onSaveDay() {
    if (this.mealInProgress) {
      this.snackBar.open("A current meal is in progress", "OK", {
        duration: 2000,
      })
      return
    }
    if (this.meals.length === 0) {
      this.snackBar.open("No meals to save", "OK", {
        duration: 2000,
      })
      return
    }

    let dayTimestamp = localStorage.getItem("dayTimestamp")
    if (!dayTimestamp) {
      dayTimestamp = new Date().toISOString()
    }

    this.days.push(new Day(dayTimestamp, this.meals))
    this.meals = []
    this.mealsTree = {}
    this.daysTree = this.buildDaysTree(this.days.slice().reverse())

    localStorage.setItem("days", JSON.stringify(this.days))
    localStorage.setItem("meals", "[]")
    localStorage.removeItem("dayTimestamp")
  }

  onClearLastDay() {
    const dialogRef = this.dialog.open(ConfirmationComponentComponent, {
      width: '350px',
      data: "Are you sure you want to clear the latest day?"
    })

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (!result) return

      this.days.splice(this.days.length - 1)
      this.daysTree = this.buildDaysTree(this.days.slice().reverse())
      localStorage.setItem("days", JSON.stringify(this.days))
    })
  }
}
