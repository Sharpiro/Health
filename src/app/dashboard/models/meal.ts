import { MealEntry } from './mealEntry'

export class Meal {
  mealEntries: MealEntry[] = []

  get calories(): number {
    return this.mealEntries.reduce((prev, curr) => prev + curr.calories, 0)
  }

  constructor(partial: Partial<Meal>) {
    this.mealEntries = partial.mealEntries
  }
}
