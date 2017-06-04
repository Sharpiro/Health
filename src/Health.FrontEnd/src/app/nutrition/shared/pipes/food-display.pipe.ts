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
    const foods = await this.foodsPromise;
    const foodName = foods.filter(f => f.id === value);
    const transformedValue = foodName.length > 0 ? foodName[0].name : value;
    return transformedValue;
  }
}