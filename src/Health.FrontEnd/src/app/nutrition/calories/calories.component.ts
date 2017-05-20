import { Component, OnInit, Inject } from '@angular/core';
import { NutritionService } from "app/nutrition/nutrition.service";
import { IFood, ISimpleFood } from "app/nutrition/shared/dtos/ifood";
import { MealEntry } from "app/nutrition/shared/dtos/mealEntry";
import { Meal } from "app/nutrition/shared/dtos/meal";
import { Day } from "app/nutrition/shared/dtos/day";
import { INotificationService } from "app/shared/i-notification-service";
import { CaloriesViewModel } from "app/nutrition/calories/calories-view-model";

@Component({
  selector: 'app-calories',
  templateUrl: './calories.component.html',
  styleUrls: ['./calories.component.css']
})
export class CaloriesComponent implements OnInit {
  public viewModel = new CaloriesViewModel();

  constructor(private nutritionService: NutritionService, @Inject('INotificationService') private notificationService: INotificationService) { }

  ngOnInit() {
    this.nutritionService.getLatestDay().subscribe(value => this.viewModel.latestDay = value, error => this.notificationService.error(error.message));
    this.nutritionService.getallActiveFoods().subscribe(value => {
      this.viewModel.allActiveFoods = value
      this.viewModel.filteredFoods = this.viewModel.allActiveFoods;
      if (this.viewModel.filteredFoods.length > 0) {
        this.viewModel.selectedFood = this.viewModel.allActiveFoods[0];
        this.viewModel.activeMealEntry = { calories: this.viewModel.selectedFood.calories, servingSize: this.viewModel.selectedFood.servingSize };
      }
    }, error => this.notificationService.error(error.message));
    this.loadFromLocalStorage();
  }

  public loadFromLocalStorage() {
    var data = localStorage.getItem("activeMeal");
    if (!data) return;
    this.viewModel.activeMeal = JSON.parse(data);
  }

  public addDay(): void {
    this.nutritionService.addDay().subscribe(value => {
      this.viewModel.latestDay = value
      this.notificationService.success("Successfully added day");
    }, error => this.notificationService.error(error.message));
  }

  public clearDay(): void {
    var response = confirm("Are you sure you want to clear the day?");
    if (!response) return;
    this.nutritionService.clearDay().subscribe(value => {
      this.viewModel.latestDay = value;
      this.clearMeal();
      this.notificationService.success("Successfully cleared day");
    }, error => this.notificationService.error(error.message));
  }
  public pruneDays(): void {
    this.nutritionService.pruneDays().subscribe(value => {
      this.notificationService.success("Successfully pruned invalid days");
    }, error => this.notificationService.error(error.message));
  }

  public addFood(): void {
    if (!this.viewModel.activeMeal)
      this.viewModel.activeMeal = new Meal(
        { dayId: this.viewModel.latestDay.id, mealNumber: this.viewModel.latestDay.meals.length + 1 }
      );

    this.viewModel.activeMeal.mealEntries.push(new MealEntry({
      mealEntryNumber: this.viewModel.activeMeal.mealEntries.length + 1,
      foodId: this.viewModel.selectedFood.id, calories: this.viewModel.activeMealEntry.calories
    }))
    localStorage.setItem("activeMeal", JSON.stringify(this.viewModel.activeMeal));
  }

  public clearMeal(): void {
    this.viewModel.activeMeal = null;
    localStorage.removeItem("activeMeal");
  }

  public saveMeal() {
    if (!this.viewModel.activeMeal) return;
    this.viewModel.latestDay.meals.push(this.viewModel.activeMeal);
    this.nutritionService.updateDay(this.viewModel.latestDay).subscribe(value => {
      this.viewModel.latestDay = value
      this.clearMeal();
      this.notificationService.success("Successfully saved meal");
    }, error => this.notificationService.error(error.message));
    console.log(this.viewModel.latestDay);
  }

  public updateCalories() {
    if (!this.viewModel.selectedFood) return;
    let caloriesPerServing = this.viewModel.selectedFood.calories / this.viewModel.selectedFood.servingSize;
    let calories = Math.ceil(this.viewModel.activeMealEntry.servingSize * caloriesPerServing);
    this.viewModel.activeMealEntry.calories = calories;
  }

  public updateServing() {
    if (!this.viewModel.selectedFood) return;
    let numberOfServings = this.viewModel.activeMealEntry.calories / this.viewModel.selectedFood.calories;
    let servingSize = numberOfServings * this.viewModel.selectedFood.servingSize;
    this.viewModel.activeMealEntry.servingSize = servingSize;
  }

  public foodSelectionChanged(newValue: IFood) {
    this.viewModel.selectedFood = newValue;
    this.viewModel.activeMealEntry = this.viewModel.selectedFood ?
      { calories: this.viewModel.selectedFood.calories, servingSize: this.viewModel.selectedFood.servingSize } :
      { calories: 0, servingSize: 0 };
  }

  public updateFilter(event: KeyboardEvent): void {
    this.viewModel.filteredFoods = this.viewModel.allActiveFoods.filter(f => f.name.toLowerCase().includes(this.viewModel.filterString.toLowerCase()));
    var filteredFood = this.viewModel.filteredFoods.length > 0 ? this.viewModel.filteredFoods[0] : null;
    this.foodSelectionChanged(filteredFood);
  }
}