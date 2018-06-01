import { MealEntry } from "app/nutrition/shared/dtos/mealEntry";

export class Meal {
    public id = 0;
    public mealNumber = 0;
    public dayId = 0;
    public mealEntries: MealEntry[] = [];

    public constructor(init?: Partial<Meal>) {
        Object.assign(this, init);
    }
}