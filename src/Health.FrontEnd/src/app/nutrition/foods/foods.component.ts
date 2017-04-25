import { Component, OnInit } from '@angular/core';
import { NutritionService } from "app/nutrition/nutrition.service";

@Component({
  selector: 'app-foods',
  templateUrl: './foods.component.html',
  styleUrls: ['./foods.component.css']
})
export class FoodsComponent implements OnInit {
  private settings = {
    columns: {
      name: {
        title: 'name'
      },
      calories: {
        title: 'calories'
      },
      protein: {
        title: 'protein'
      },
      fat: {
        title: 'fat'
      },
      carbs: {
        title: 'carbs'
      },
      sugar: {
        title: 'sugar'
      },
      servingSize: {
        title: 'servingSize'
      },
      servingName: {
        title: 'servingSize'
      },
      fiber: {
        title: 'fiber'
      },
      sodium: {
        title: 'sodium'
      },
      potassium: {
        title: 'potassium'
      }
    }
  };
  private data = [
    { name: "Chicken", "calories": 120, "protein": 26, "fat": 1, "carbs": 0, "sugar": 0, "servingSize": 4, "servingName": "oz", "fiber": 0, "sodium": 50, "potassium": 0 }
  ];
  private otherData = [
    { name: "ChickenX", "calories": 120, "protein": 26, "fat": 1, "carbs": 0, "sugar": 0, "servingSize": 4, "servingName": "oz", "fiber": 0, "sodium": 50, "potassium": 0 }
  ];

  constructor(private nutritionService: NutritionService) { }

  async ngOnInit() {
    // var temp = await this.nutritionService.getAllFoods().toPromise();
    // this.nutritionService.getAllFoods().subscribe(value => {
    //   this.data = value;
    // });
    // var temp2 = temp.slice(0, 1).map(f => {
    //   return { name: "ChickenX", "calories": 120, "protein": 26, "fat": 1, "carbs": 0, "sugar": 0, "servingSize": 4, "servingName": "oz", "fiber": 0, "sodium": 50, "potassium": 0 }
    // });
    this.data = this.otherData;
  }
}
