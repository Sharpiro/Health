import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-more-options',
  templateUrl: './more-options.component.html',
  styleUrls: ['./more-options.component.css']
})
export class MoreOptionsComponent {
  constructor(
    public dialogRef: MatDialogRef<MoreOptionsComponent>,
    @Inject(MAT_DIALOG_DATA) public foods: any) { }

  selectFunction(name?: string) {
    this.dialogRef.close(name);
  }
}
