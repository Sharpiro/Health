import { Pipe, PipeTransform } from '@angular/core';
import { NutritionService } from "app/nutrition/nutrition.service";
import { IFood } from "app/nutrition/shared/dtos/ifood";
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Pipe({
  name: 'foodDisplay'
})
export class FoodDisplayPipe implements PipeTransform {
  private foodsPromise: Promise<IFood[]>;

  constructor(private nutritionService: NutritionService) { }

  async transform(value: any, args?: any) {
    if (!this.foodsPromise)
      this.foodsPromise = this.nutritionService.getAllFoods().toPromise();
    var foods = await this.foodsPromise;
    var foodName = foods.filter(f => f.id == value);
    var transformedValue = foodName.length > 0 ? foodName[0].name : value;
    return transformedValue;
  }
}