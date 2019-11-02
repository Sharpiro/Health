import { MealEntry } from './mealEntry'

export class Meal {
  mealEntries: MealEntry[] = []
  calories: number

  constructor(partial: Partial<Meal>) {
    this.mealEntries = partial.mealEntries
    this.calories = this.mealEntries.reduce((prev, curr) => prev + curr.calories, 0)
  }
}
