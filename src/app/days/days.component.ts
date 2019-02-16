import { Component, OnInit } from '@angular/core';
import { Meal } from '../dashboard/models/meal';
import { Day } from '../dashboard/models/day';
import { MatDialog } from '@angular/material';
import { ConfirmationComponentComponent } from '../confirmation-component/confirmation-component.component';

@Component({
  selector: 'app-days',
  templateUrl: './days.component.html',
  styleUrls: ['./days.component.css']
})
export class DaysComponent implements OnInit {
  days: Day[]

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    const daysJson = localStorage.getItem("days")
    this.days = daysJson ? JSON.parse(daysJson) : []
  }

  onSaveDay() {
    let dayTimestamp = localStorage.getItem("dayTimestamp")
    if (!dayTimestamp) {
      dayTimestamp = new Date().toISOString()
    }
    const mealsJson = localStorage.getItem("meals")
    const currentMeals: Meal[] = mealsJson ? JSON.parse(mealsJson) : []
    this.days.push(new Day(dayTimestamp, currentMeals))
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
      localStorage.setItem("days", JSON.stringify(this.days))
    })
  }
}
