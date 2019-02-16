import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-days',
  templateUrl: './days.component.html',
  styleUrls: ['./days.component.css']
})
export class DaysComponent implements OnInit {
  days: number[]

  constructor() { }

  ngOnInit() {
    const daysJson = localStorage.getItem("days")
    this.days = daysJson ? JSON.parse(daysJson).map((m: any) => m) : []
  }
}
