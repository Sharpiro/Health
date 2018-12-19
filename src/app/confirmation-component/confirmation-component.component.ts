import { Component, OnInit, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'

@Component({
  selector: 'app-confirmation-component',
  templateUrl: './confirmation-component.component.html',
  styleUrls: ['./confirmation-component.component.css']
})
export class ConfirmationComponentComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string) { }
}
