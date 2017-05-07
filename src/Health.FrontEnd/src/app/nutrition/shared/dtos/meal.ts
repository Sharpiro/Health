import { MealEntry } from "app/nutrition/shared/dtos/mealEntry";

export class Meal {
    public id: number = 0;
    public mealNumber: number = 0;
    public dayId: number = 0;
    public mealEntries: MealEntry[] = [];

    public constructor(init?: Partial<Meal>) {
        Object.assign(this, init);
    }
}