import { Component, OnInit } from '@angular/core';
// import {} from "chartist"
// import "chartist"
import * as Chartist from 'chartist';
// import "chartist-plugin-tooltip"

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  // private data = {
  //   labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  //   series: [
  //     [5, 2, 4, 2, 0]
  //   ]
  // };

  // private chart = new Chartist.Line('.ct-chart', this.data);
  //   private chart = new Chartist.Line('.ct-chart', {
  //   labels: [1, 2, 3],
  //   series: [
  //     [
  //       {meta: 'description', value: 1 },
  //       {meta: 'description', value: 5},
  //       {meta: 'description', value: 3}
  //     ],
  //     [
  //       {meta: 'other description', value: 2},
  //       {meta: 'other description', value: 4},
  //       {meta: 'other description', value: 2}
  //     ]
  //   ]
  // }, {
  //   low: 0,
  //   high: 8,
  //   fullWidth: true,
  //   // plugins: [
  //   //   Chartist.plugins.tooltip()
  //   // ]
  // });

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
        { meta: '2091', value: 2091 },
        { meta: '2885', value: 2885 },
        { meta: '1821', value: 1821 },
        { meta: '2616', value: 2616 },
        { meta: '2254', value: 2254 },
        { meta: '2602', value: 2602 },
        { meta: '1927', value: 1927 }
      ]
    ]
  }
  // private plugins = [
  //   Chartist.plugins.tooltip(),
  // ];
  private type = "Line";
  private options = {
    low: 0
  };

  constructor() { }

  ngOnInit() {

  }

  public click() {
    var element = document.getElementById("testChart");
    console.log(element);
  }

}
// declare var Chartist
// // namespace Chartist {
// //   export let plugins: any;
// // }

