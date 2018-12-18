import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { Food } from '../dashboard/models/food'

import { disableBodyScroll } from 'body-scroll-lock'



@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.css']
})
export class CustomSelectComponent implements OnInit {
  ngOnInit(): void {
    disableBodyScroll(document.getElementsByClassName("cdk-overlay-container")[0])
  }

  constructor(
    public dialogRef: MatDialogRef<CustomSelectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  selectFood(food: Food) {
    this.dialogRef.close(food)
  }
}
