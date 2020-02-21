import { Food } from "../models/food"
import foods from "./food-list.json"
import simpleData from "./simple.json"

// todo: validate properties
export const FoodList = (foods as Food[])
    .filter(f => f.active)
    .sort((first, second) => first.name.charCodeAt(0) - second.name.charCodeAt(0))

export const FoodMap = FoodList.reduce((map, curr) => {
    map.set(curr.name, curr)
    return map
}, new Map<string, Food>())
