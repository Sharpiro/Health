import { MealEntry } from './mealEntry'

export class Meal {

  public get calories(): number {
    return this.mealEntries.reduce((prev, curr) => prev + curr.calories, 0)
  }

  constructor(readonly mealEntries: MealEntry[]) { }

  toJSON() {
    return {
      ...this,
      calories: this.calories
    }
  }
}
