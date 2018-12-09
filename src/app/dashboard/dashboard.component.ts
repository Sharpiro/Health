import { Component, OnInit } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatTableDataSource } from '@angular/material/table'
import { Meal } from './models/meal'
import { MealEntry } from "./models/mealEntry"
import { Food } from './models/food'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  meals: Meal[] = []
  displayedColumns: string[] = ['foodName', 'calories']
  foods = FoodList
  currentMealEntriesDataSource = new MatTableDataSource<MealEntry>()
  mealEntryCalorieFormControl = new FormControl('', [Validators.required])
  mealEntryServingSizeFormControl = new FormControl('', [Validators.required])
  foodFormControl = new FormControl('', [Validators.required])
  currentMealCaloriesControl = new FormControl('', [Validators.required])
  allMealsCaloriesControl = new FormControl('', [Validators.required])

  constructor(public snackBar: MatSnackBar) { }

  ngOnInit() {
    const mealEntriesJson = localStorage.getItem("mealEntries")
    this.currentMealEntriesDataSource.data = mealEntriesJson ? JSON.parse(mealEntriesJson) : []

    const mealsJson = localStorage.getItem("meals")
    this.meals = mealsJson ? JSON.parse(mealsJson).map(m => new Meal(m)) : []

    this.foodFormControl.valueChanges.subscribe(this.onFoodChanges)

    // todo: set to local storage loaded values
    this.updateAggregateCalories()

    this.foodFormControl.setValue(this.getRandomFood())
  }

  onAddFood() {
    if (!this.foodFormControl.value) {
      this.snackBar.open("Enter valid food", "OK", {
        duration: 2000,
      })
      return
    }
    if (this.mealEntryCalorieFormControl.value <= 0) {
      this.snackBar.open("Enter valid calories", "OK", { duration: 2000, })
      return
    }

    const food: Food = this.foodFormControl.value
    const currentMealEntries = this.currentMealEntriesDataSource.data
    currentMealEntries.push({ foodId: food.id, foodName: food.name, calories: this.mealEntryCalorieFormControl.value })
    this.currentMealEntriesDataSource = new MatTableDataSource(currentMealEntries)
    localStorage.setItem("mealEntries", JSON.stringify(currentMealEntries))
    this.updateAggregateCalories()
  }

  onSaveMeal() {
    if (this.currentMealEntriesDataSource.data.length === 0) {
      this.snackBar.open("Enter Meal Information", "OK", { duration: 2000, })
      return
    }
    const newMeal = new Meal({ mealEntries: this.currentMealEntriesDataSource.data, calories: 5 })
    this.meals.push(newMeal)
    this.currentMealEntriesDataSource = new MatTableDataSource()
    localStorage.removeItem("mealEntries")
    localStorage.setItem("meals", JSON.stringify(this.meals))
    this.updateAggregateCalories()
  }

  onClearMeal() {
    this.currentMealEntriesDataSource = new MatTableDataSource()
    localStorage.removeItem("mealEntries")
    this.updateAggregateCalories()
  }

  onClearDay() {
    this.onClearMeal()
    this.meals = []
    localStorage.removeItem("meals")
    this.updateAggregateCalories()
  }

  onFoodChanges = (food: Food) => {
    if (!food) return

    this.mealEntryCalorieFormControl.setValue(food.calories)
    this.mealEntryServingSizeFormControl.setValue(food.servingSize)
  }

  updateCaloriesFromServingSize = () => {
    const food: Food = this.foodFormControl.value
    const mealEntryservingSize: number = this.mealEntryServingSizeFormControl.value
    const caloriesPerOneOfServingType = food.calories / food.servingSize
    const mealEntryCalories = mealEntryservingSize * caloriesPerOneOfServingType
    this.mealEntryCalorieFormControl.setValue(mealEntryCalories)
  }

  updateServingSizeFromCalories = () => {
    const food: Food = this.foodFormControl.value
    const mealEntryCalories: number = this.mealEntryCalorieFormControl.value
    const caloriesPerOneOfServingType = food.calories / food.servingSize
    const mealEntryServingSize = mealEntryCalories / caloriesPerOneOfServingType
    this.mealEntryServingSizeFormControl.setValue(mealEntryServingSize)
  }

  private getRandomFood(): Food {
    const randomIndex = Math.floor(Math.random() * FoodList.length)
    return FoodList[randomIndex]
  }

  private updateAggregateCalories() {
    const currentMealEntriesSum = this.currentMealEntriesDataSource.data.reduce((prev, curr) => prev + curr.calories, 0)
    const mealsSum = this.meals.reduce((prev, curr) => prev + curr.calories, 0)
    const totalCalories = currentMealEntriesSum + mealsSum
    this.currentMealCaloriesControl.setValue(currentMealEntriesSum)
    this.allMealsCaloriesControl.setValue(totalCalories)
  }
}

const FoodList: Food[] = [
  { id: 1, name: "Chicken", calories: 120, servingSize: 4, servingSizeType: "Grams" },
  { id: 2, name: "Egg", calories: 70, servingSize: 1, servingSizeType: "Egg" }
]

const FoodMap = FoodList.reduce((map, curr) => {
  map.set(curr.name, curr)
  return map
}, new Map<string, Food>())
