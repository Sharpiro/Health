import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
// import { disableBodyScroll } from 'body-scroll-lock'

type Nameable = { name: string }

@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.css']
})
export class CustomSelectComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<CustomSelectComponent>,
    @Inject(MAT_DIALOG_DATA) public items: Nameable[]) { }

  ngOnInit(): void {
    // disableBodyScroll(document.getElementsByClassName("cdk-overlay-container")[0])
  }

  selectItem(item: Nameable) {
    this.dialogRef.close(item)
  }
}
