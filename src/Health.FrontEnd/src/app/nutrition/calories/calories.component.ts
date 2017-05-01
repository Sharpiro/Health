import { Component, OnInit } from '@angular/core';
import { NutritionService } from "app/nutrition/nutrition.service";
import { IFood, ISimpleFood } from "app/nutrition/shared/ifood";
import { IMealEntry } from "app/nutrition/shared/imealEntry";

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
  private mealEntries: IMealEntry[] = [];
  private activeMealEntry: ISimpleFood;

  constructor(private nutritionService: NutritionService) { }

  async ngOnInit() {
    this.allActiveFoods = await this.nutritionService.getallActiveFoods().toPromise();
    this.filteredFoods = this.allActiveFoods;
    if (this.filteredFoods.length > 0) {
      this.selectedFood = this.allActiveFoods[0];
      this.activeMealEntry = { calories: this.selectedFood.calories, servingSize: this.selectedFood.servingSize };
    }
  }

  private updateFilter(event: KeyboardEvent): void {
    this.filteredFoods = this.allActiveFoods.filter(f => f.name.toLowerCase().includes(this.filterString.toLowerCase()));
    if (this.filteredFoods.length > 0)
      this.selectedFood = this.filteredFoods[0];
  }

  private addFood(calories: number, servingSize: number): void {
    this.mealEntries.push({
      id: 0, mealEntryNumber: this.mealEntries.length + 1, mealId: 0,
      foodId: this.selectedFood.id, calories: this.activeMealEntry.calories
    })
    console.log(this.mealEntries);
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