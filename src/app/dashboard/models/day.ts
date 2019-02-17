import { Meal } from './meal';

export class Day {
    timestamp: string
    calories: number
    meals: Meal[] = []

    constructor(timestamp: string, meals: Meal[]) {
        this.timestamp = timestamp
        this.meals = meals
        this.calories = meals.reduce((prev, cur) => prev + cur.calories, 0)
    }
}
