import foods from "./food-list.json";
import meals from "./grouped-foods.json";
import { validateArray } from 'src/lib/validation';
import { Food, GroupedFood, FoodInfo } from './food.js';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: "root" })
export class FoodService {
  async getFoodList(showAll = false) {
    const rawFoods = await this.getRawFoods();
    let foods = this.validateFoods(rawFoods);
    if (!showAll) {

      foods = foods.filter(f => f.active);
    }
    return foods
      .sort((first, second) => first.name.charCodeAt(0) - second.name.charCodeAt(0));
  }

  async getFoodMap() {
    const foodList = await this.getFoodList();
    return foodList.reduce((map, curr) => {
      map.set(curr.name, curr);
      return map;
    }, new Map<string, Food>());
  }

  async getGroupedFoods(): Promise<GroupedFood[]> {
    const foodMap = await this.getFoodMap();
    const groupedFoods = meals.map(meal => {
      const computedFoods = getComputedFood(meal.foods);
      return { ...meal, foods: computedFoods };
    });

    return groupedFoods;

    function getComputedFood(foods: Omit<FoodInfo, "calories">[]) {
      return foods.map(mealFood => {
        const food = foodMap.get(mealFood.name);
        if (!food) throw new Error(`could not find food '${mealFood.name}'`);

        const servingCalories = Math.round(food.calories / food.servingSize * mealFood.servingSize);
        return { ...mealFood, calories: servingCalories };
      });
    }
  }

  private getRawFoods() {
    return Promise.resolve(foods) as Promise<Partial<Food | undefined>[] | undefined>;
  }

  private validateFoods(foods: any[] | undefined): Food[] {
    const tempFoods = foods?.map(f => new Food(f));
    for (const validationErrors of validateArray(tempFoods)) {
      if (validationErrors.length) {
        const food = validationErrors[0].target as Food | undefined;
        console.error(validationErrors, food);
        throw new Error(`'${food?.name}' in food list has validation errors`);
      }
    }
    return tempFoods as Food[];
  }
}
