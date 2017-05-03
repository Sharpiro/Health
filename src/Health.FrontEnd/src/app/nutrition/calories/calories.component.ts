import { Component, OnInit } from '@angular/core';
import { NutritionService } from "app/nutrition/nutrition.service";
import { IFood, ISimpleFood } from "app/nutrition/shared/ifood";
import { MealEntry } from "app/nutrition/shared/mealEntry";
import { Meal } from "app/nutrition/shared/meal";
import { Day } from "app/nutrition/shared/day";

@Component({
  selector: 'app-calories',
  templateUrl: './calories.component.html',
  styleUrls: ['./calories.component.css']
})
export class CaloriesComponent implements OnInit {
  private allActiveFoods: Array<IFood> = [];
  private filteredFoods: Array<IFood> = [];
  private filterString: string;
  private selectedFood: IFood;
  private activeMealEntry: ISimpleFood;
  private activeMeal: Meal;
  private latestDay: Day;

  constructor(private nutritionService: NutritionService) { }

  async ngOnInit() {
    var latestDayPromise = this.nutritionService.getLatestDay().toPromise();
    this.allActiveFoods = await this.nutritionService.getallActiveFoods().toPromise();
    this.filteredFoods = this.allActiveFoods;
    if (this.filteredFoods.length > 0) {
      this.selectedFood = this.allActiveFoods[0];
      this.activeMealEntry = { calories: this.selectedFood.calories, servingSize: this.selectedFood.servingSize };
    }
    this.latestDay = await latestDayPromise;
    console.log(this.latestDay);
  }

  private updateFilter(event: KeyboardEvent): void {
    this.filteredFoods = this.allActiveFoods.filter(f => f.name.toLowerCase().includes(this.filterString.toLowerCase()));
    if (this.filteredFoods.length > 0)
      this.selectedFood = this.filteredFoods[0];
  }

  private async addDay() {
    this.latestDay = await this.nutritionService.addDay().toPromise();
  }

  private async clearDay() {
    this.latestDay = await this.nutritionService.clearDay().toPromise();;
  }

  private addFood(calories: number, servingSize: number): void {
    if (!this.activeMeal)
      this.activeMeal = new Meal(
        { dayId: this.latestDay.id, mealNumber: this.latestDay.meals.length + 1 }
      );

    this.activeMeal.mealEntries.push(new MealEntry({
      mealEntryNumber: this.activeMeal.mealEntries.length + 1,
      foodId: this.selectedFood.id, calories: this.activeMealEntry.calories
    }))
    console.log(this.latestDay);
  }

  private clearMeal(): void {
    this.activeMeal = new Meal();
    console.log("clearning...")
  }

  private async saveMeal() {
    if (!this.activeMeal) return;
    this.latestDay.meals.push(this.activeMeal);
    this.activeMeal = null;
    this.latestDay = await this.nutritionService.updateDay(this.latestDay).toPromise();
    console.log(this.latestDay);
  }

  private updateCalories() {
    let caloriesPerServing = this.selectedFood.calories / this.selectedFood.servingSize;
    let calories = Math.ceil(this.activeMealEntry.servingSize * caloriesPerServing);
    this.activeMealEntry.calories = calories;
  }

  private updateServing() {
    let numberOfServings = this.activeMealEntry.calories / this.selectedFood.calories;
    let servingSize = numberOfServings * this.selectedFood.servingSize;
    this.activeMealEntry.servingSize = servingSize;
  }

  private foodSelectionChanged(newValue: IFood) {
    this.selectedFood = newValue;
    this.activeMealEntry = { calories: this.selectedFood.calories, servingSize: this.selectedFood.servingSize };
  }
}