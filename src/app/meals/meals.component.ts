import { Component, OnInit, LOCALE_ID, Inject } from '@angular/core'
import { Meal } from '../dashboard/models/meal'
import { MatDialog } from '@angular/material';
import { ConfirmationComponentComponent } from '../confirmation-component/confirmation-component.component';
import { Day } from '../dashboard/models/day';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.css']
})
export class MealsComponent implements OnInit {
  meals: Meal[]
  days: Day[]
  mealsTree: any
  daysTree: any


  constructor(private dialog: MatDialog, @Inject(LOCALE_ID) private locale: string) { }

  ngOnInit() {
    // initialize days tree
    const daysJson = localStorage.getItem("days")
    this.days = daysJson ? JSON.parse(daysJson) : []
    this.daysTree = this.buildDaysTree(this.days.slice().reverse())

    // initialize meals tree
    const mealsJson = localStorage.getItem("meals")
    this.meals = mealsJson ? JSON.parse(mealsJson) : []
    this.mealsTree = this.buildMealsTree(this.meals)
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
    console.log("clearing meals...");
    let dayTimestamp = localStorage.getItem("dayTimestamp")
    if (!dayTimestamp) {
      dayTimestamp = new Date().toISOString()
    }

    this.days.push(new Day(dayTimestamp, this.meals))
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
