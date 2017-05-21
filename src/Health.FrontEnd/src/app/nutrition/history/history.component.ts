import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  private data = {
    "labels": [
      "-1",
      "-2",
      "-3",
      "-4",
      "-5",
      "-6",
      "-7",
    ],
    "series": [
      [
        { meta: 'description', value: 2091 },
        { meta: 'description', value: 2885 },
        { meta: 'description', value: 1821 },
        { meta: 'description', value: 2616 },
        { meta: 'description', value: 2254 },
        { meta: 'description', value: 2602 },
        { meta: 'description', value: 1927 }
      ]
    ]
  }
  private type = "Line";
  private options = {
    low: 0
  };

  constructor() { }

  ngOnInit() {
  }

}
