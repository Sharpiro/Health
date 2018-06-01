import { Meal } from "app/nutrition/shared/dtos/meal";

export class Day {
    public id = 0;
    public date: string;
    public meals: Meal[] = [];
    public totalCalories: number;

    public constructor(init?: Partial<Meal>) {
        Object.assign(this, init);
    }
}