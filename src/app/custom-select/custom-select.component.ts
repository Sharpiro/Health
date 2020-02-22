import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { disableBodyScroll } from 'body-scroll-lock'
import { Food } from '../shared/foods/food'

@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.css']
})
export class CustomSelectComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<CustomSelectComponent>,
    @Inject(MAT_DIALOG_DATA) public foods: Food[]) { }

  ngOnInit(): void {
    disableBodyScroll(document.getElementsByClassName("cdk-overlay-container")[0])
  }

  selectFood(food: Food) {
    this.dialogRef.close(food)
  }
}
