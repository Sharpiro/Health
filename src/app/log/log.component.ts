import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {
  messageFormControl = new FormControl();
  logs: any[] = [];

  constructor(readonly snackBar: MatSnackBar) {
    this.logs = JSON.parse(localStorage.getItem("logs") ?? "[]");
  }

  ngOnInit(): void { }

  submitLog() {
    if (!this.messageFormControl.value) {
      this.snackBar.open("Please enter a message", "OK", {
        duration: 2000,
      });
      return;
    }

    const logObj = {
      date: new Date(),
      message: this.messageFormControl.value
    };
    this.logs.push(logObj);
    localStorage.setItem("logs", JSON.stringify(this.logs));
    this.messageFormControl.reset();
  }

  deleteLastLog() {
    this.logs = this.logs.slice(0, this.logs.length - 1);
    localStorage.setItem("logs", JSON.stringify(this.logs));
  }
}
