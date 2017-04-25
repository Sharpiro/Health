import { Component, OnInit } from '@angular/core';
import { NutritionService } from "app/nutrition/nutrition.service";

@Component({
  selector: 'app-nutrition',
  template: `<router-outlet></router-outlet>`,
  styles: [],
  providers: [NutritionService]
})
export class NutritionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
