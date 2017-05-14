import { IFood, ISimpleFood } from "app/nutrition/shared/dtos/ifood";
import { Meal } from "app/nutrition/shared/dtos/meal";
import { Day } from "app/nutrition/shared/dtos/day";

export class CaloriesViewModel {

    public allActiveFoods: Array<IFood> = [];
    public filteredFoods: Array<IFood> = [];
    public filterString: string;
    public selectedFood: IFood;
    public activeMealEntry: ISimpleFood;
    public activeMeal: Meal;
    public latestDay: Day;

    public getTotalCalories(): number {
        let mealCalories = this.activeMeal ? this.activeMeal.mealEntries.map(m => m.calories).reduce((a, b) => a + b, 0) : 0;
        let latestDayCalories = this.latestDay ? this.latestDay.totalCalories : 0;
        return mealCalories + latestDayCalories;
    }
}