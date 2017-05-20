import { Meal } from "app/nutrition/shared/dtos/meal";

export class Day {
    public id: number = 0;
    public date: Date;
    public meals: Meal[] = [];
    public totalCalories: number;

    public constructor(init?: Partial<Meal>) {
        Object.assign(this, init);
    }
}