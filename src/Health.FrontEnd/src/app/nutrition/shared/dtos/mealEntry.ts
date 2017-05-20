export class MealEntry {
    id: number;
    mealEntryNumber: number;
    mealId: number;
    foodId: number;
    calories: number;

    public constructor(init?: Partial<MealEntry>) {
        Object.assign(this, init);
    }
}