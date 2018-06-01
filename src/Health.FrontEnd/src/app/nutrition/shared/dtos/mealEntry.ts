import * as moment from 'moment';

export class MealEntry {
    id: number;
    mealEntryNumber: number;
    mealId: number;
    foodId: number;
    calories: number;
    timeStamp: string;

    public constructor(init?: Partial<MealEntry>) {
        Object.assign(this, init);
    }
}