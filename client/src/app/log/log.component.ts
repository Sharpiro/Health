import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { exportText } from '../shared/foods/helpers';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {
  messageFormControl = new FormControl();
  logTypeFormControl: FormControl;
  logs: Log[] = [];

  constructor(readonly snackBar: MatSnackBar) {
    this.logs = JSON.parse(localStorage.getItem("logs") ?? "[]");

    const lastLogType = localStorage.getItem("lastLogType") ?? "general";
    this.logTypeFormControl = new FormControl(lastLogType);
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
      date: new Date().toISOString(),
      message: this.messageFormControl.value,
      type: this.logTypeFormControl.value
    };
    this.logs.push(logObj);
    localStorage.setItem("logs", JSON.stringify(this.logs));
    localStorage.setItem("lastLogType", this.logTypeFormControl.value);
    this.messageFormControl.reset();
  }

  deleteLastLog() {
    this.logs = this.logs.slice(0, this.logs.length - 1);
    localStorage.setItem("logs", JSON.stringify(this.logs));
  }

  export() {
    const filename = `${new Date().toISOString()}_health_logs_export.json.txt`;
    const logsText = localStorage.getItem("logs") ?? "[]";
    exportText(filename, logsText);
  }
}

interface Log {
  date: string;
  message: string;
  type: string;
}
