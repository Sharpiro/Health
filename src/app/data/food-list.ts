import { Food } from "../models/food"
import foods from "./food-list.json"

// function validateFoods(foods: (Partial<Food> | undefined)[]): Food[] {
//   for (const food of foods) {
//     // food.active
//     assert(food)
//     assert(food.calories)
//   }
//   throw new Error()
// }

// function assert<T>(val: T): asserts val is NonNullable<T> {
//   if (val === undefined || val === null) {
//     throw new Error("validation failed")
//   }
// }

// todo: validate properties
export const FoodList = (foods as Food[])
  .filter(f => f.active)
  .sort((first, second) => first.name.charCodeAt(0) - second.name.charCodeAt(0))

export const FoodMap = FoodList.reduce((map, curr) => {
  map.set(curr.name, curr)
  return map
}, new Map<string, Food>())
