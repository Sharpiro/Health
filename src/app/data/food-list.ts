import { Food } from "../models/food"
import foods from "./food-list.json"

function validateFoods(foods: any): Food[] {
  // assertArray(foods, 1)
  // const validatedFoods = []
  // for (const food of foods) {
  //   assert<Partial<Food>>(food)
  //   assert(food.name)
  //   assert(food.shortName)
  //   assert(food.calories)
  //   validatedFoods.push(food)
  // }
  // return validatedFoods
  return foods as any
}

function assertArray(val: any, minSize: number): asserts val is Array<any> {
  if (!Array.isArray(val)) {
    throw new Error("array was undefined")
  }
  if (val.length < minSize) {
    throw new Error(`array length was '${minSize}'`)
  }
}

// function assertAny(val: any[]) {
//   if (val.length <= 0) {
//     throw new Error("'array length was 0")
//   }
// }

function assert<T>(val: T): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    throw new Error("validation failed")
  }
}

// todo: validate properties
export const FoodList = validateFoods(foods as any)
  .filter(f => f.active)
  .sort((first, second) => first.name.charCodeAt(0) - second.name.charCodeAt(0))

export const FoodMap = FoodList.reduce((map, curr) => {
  map.set(curr.name, curr)
  return map
}, new Map<string, Food>())
