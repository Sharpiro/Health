import { MealEntry } from './mealEntry'

// export interface Meal {
//   mealEntries: MealEntry[]
//   calories: number
// }

export class Meal {
  calories: number

  constructor(readonly mealEntries: MealEntry[]) {
    this.calories = mealEntries.reduce((prev, curr) => prev + curr.calories, 0)
  }
}
