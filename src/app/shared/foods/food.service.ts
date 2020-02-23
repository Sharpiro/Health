import foods from "./food-list.json"
import meals from "./meals.json"
import { validateArray } from 'src/lib/validation'
import { Food } from './food.js'
import { Injectable } from '@angular/core'

@Injectable({ providedIn: "root" })
export class FoodService {
  async getFoodList() {
    const rawFoods = await this.getRawFoods()
    return this.validateFoods(rawFoods)
      .filter(f => f.active)
      .sort((first, second) => first.name.charCodeAt(0) - second.name.charCodeAt(0))
  }

  async getFoodMap() {
    const foodList = await this.getFoodList()
    return foodList.reduce((map, curr) => {
      map.set(curr.name, curr)
      return map
    }, new Map<string, Food>())
  }

  async getMeals() {
    const foodMap = await this.getFoodMap()
    const computedMeals = meals.map(meal => {
      const computedFoods = getComputedFood(meal.foods)
      const mealCalories = computedFoods.reduce((prev, curr) => {
        return prev + curr.calories
      }, 0)
      return { ...meal, foods: computedFoods, calories: mealCalories }
    })

    return computedMeals

    function getComputedFood(foods: typeof meals[0]["foods"]) {
      return foods.map(mealFood => {
        const food = foodMap.get(mealFood.name)
        if (!food) throw new Error(`could not find food '${mealFood.name}'`)

        const servingCalories = Math.round(food.calories / food.servingSize * mealFood.servingSize)
        return { ...mealFood, calories: servingCalories }
      })
    }
  }

  private getRawFoods() {
    return Promise.resolve(foods) as Promise<Partial<Food | undefined>[] | undefined>
  }

  private validateFoods(foods: any[] | undefined): Food[] {
    const tempFoods = foods?.map(f => new Food(f))
    for (const validationErrors of validateArray(tempFoods)) {
      if (validationErrors.length) {
        const food = validationErrors[0].target as Food | undefined
        console.error(validationErrors, food)
        throw new Error(`'${food?.name}' in food list has validation errors`)
      }
    }
    return tempFoods as Food[]
  }
}
