import { Component, OnInit } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatTableDataSource } from '@angular/material/table'
import { Meal } from './models/meal'
import { MealEntry } from "./models/mealEntry"
import { Food } from './models/food'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { MatDialog } from '@angular/material'
import { CustomSelectComponent } from '../custom-select/custom-select.component'
import { ConfirmationComponentComponent } from '../confirmation-component/confirmation-component.component'
import { MoreOptionsComponent } from '../more-options/more-options.component'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isScrollable = false
  meals: Meal[] = []
  displayedColumns: string[] = ['foodName', 'calories']
  foods = FoodList
  currentMealEntriesDataSource = new MatTableDataSource<MealEntry>()
  mealEntryCalorieFormControl = new FormControl('', [Validators.required])
  mealEntryServingSizeFormControl = new FormControl('', [Validators.required])
  foodFormControl = new FormControl('', [Validators.required])
  currentMealCaloriesControl = new FormControl('', [Validators.required])
  allMealsCaloriesControl = new FormControl('', [Validators.required])

  constructor(public snackBar: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit() {
    const mealEntriesJson = localStorage.getItem("mealEntries")
    this.currentMealEntriesDataSource.data = mealEntriesJson ? JSON.parse(mealEntriesJson) : []

    const mealsJson = localStorage.getItem("meals")
    this.meals = mealsJson ? JSON.parse(mealsJson).map(m => new Meal(m)) : []

    this.foodFormControl.valueChanges.subscribe(this.onFoodChanges)

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
    const dialogRef = this.dialog.open(ConfirmationComponentComponent, {
      width: '350px',
      data: "Are you sure you want to clear the day?"
    })

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (!result) return

      this.onClearMeal()
      this.meals = []
      localStorage.removeItem("meals")
      this.updateAggregateCalories()
    })
  }

  onFoodChanges = (food: Food) => {
    if (!food) return

    this.mealEntryCalorieFormControl.setValue(food.calories)
    this.mealEntryServingSizeFormControl.setValue(food.servingSize)
  }

  onReturnKey(event: any) {
    if (event.key === "Enter") {
      this.onAddFood()
      event.target.blur()
    }
  }

  updateCaloriesFromServingSize = () => {
    const food: Food = this.foodFormControl.value
    const mealEntryservingSize: number = this.mealEntryServingSizeFormControl.value
    const caloriesPerOneOfServingType = food.calories / food.servingSize
    const mealEntryCalories = Math.ceil(mealEntryservingSize * caloriesPerOneOfServingType)
    this.mealEntryCalorieFormControl.setValue(mealEntryCalories)
  }

  updateServingSizeFromCalories = () => {
    const food: Food = this.foodFormControl.value
    const mealEntryCalories: number = this.mealEntryCalorieFormControl.value
    const caloriesPerOneOfServingType = food.calories / food.servingSize
    const mealEntryServingSize = mealEntryCalories / caloriesPerOneOfServingType
    this.mealEntryServingSizeFormControl.setValue(mealEntryServingSize.toFixed(2))
  }

  onFoodClick() {
    const dialogRef = this.dialog.open(CustomSelectComponent, {
      width: '350px',
      data: this.foods
    })

    dialogRef.afterClosed().subscribe((food: Food) => {
      if (!food) return
      this.foodFormControl.setValue(food)
    })
  }

  onMoreOptions() {
    const dialogRef = this.dialog.open(MoreOptionsComponent, {
      width: '350px'
    })

    dialogRef.afterClosed().subscribe((result: string) => {
      if (!result) return

      switch (result) {
        case "scroll":
          this.onScrollToggle()
          break
        case "debug":
          this.onDebug()
          break
      }
    })
  }

  onDebug() {
    console.log("debugging...")
  }

  onScrollToggle() {
    if (this.isScrollable) {
      disableBodyScroll(document.querySelector("body"))
    } else {
      enableBodyScroll(document.querySelector("body"))
    }
    this.isScrollable = !this.isScrollable
  }

  private getRandomFood(): Food {
    // const randomIndex = Math.floor(Math.random() * FoodList.length)
    // return FoodList[randomIndex]
    return FoodList[0]
  }

  private updateAggregateCalories() {
    const currentMealEntriesSum = this.currentMealEntriesDataSource.data.reduce((prev, curr) => prev + curr.calories, 0)
    const mealsSum = this.meals.reduce((prev, curr) => prev + curr.calories, 0)
    const totalCalories = currentMealEntriesSum + mealsSum
    this.currentMealCaloriesControl.setValue(currentMealEntriesSum)
    this.allMealsCaloriesControl.setValue(totalCalories)
  }
}

const FoodList =
  ([
    {
      "id": 6,
      "calories": 120,
      "name": "Chicken",
      "servingSize": 4,
      "carbs": 0,
      "fat": 1,
      "fiber": 0,
      "potassium": 0,
      "protein": 26,
      "servingSizeType": "Ounces",
      "sodium": 50,
      "sugar": 0,
      "active": true
    },
    {
      "id": 7,
      "calories": 120,
      "name": "Egg w/ whites",
      "servingSize": 1,
      "carbs": 0,
      "fat": 5,
      "fiber": 0,
      "potassium": 150,
      "protein": 16,
      "servingSizeType": "Item",
      "sodium": 230,
      "sugar": 0,
      "active": true
    },
    {
      "id": 8,
      "calories": 100,
      "name": "Almonds",
      "servingSize": 18,
      "carbs": 1,
      "fat": 9,
      "fiber": 2,
      "potassium": 130,
      "protein": 4,
      "servingSizeType": "Grams",
      "sodium": 0,
      "sugar": 1,
      "active": true
    },
    {
      "id": 13,
      "calories": 180,
      "name": "ProteinBar",
      "servingSize": 1,
      "carbs": 4,
      "fat": 8,
      "fiber": 13,
      "potassium": 140,
      "protein": 20,
      "servingSizeType": "Item",
      "sodium": 170,
      "sugar": 1,
      "active": false
    },
    {
      "id": 26,
      "calories": 190,
      "name": "AlmondButter",
      "servingSize": 32,
      "carbs": 6,
      "fat": 18,
      "fiber": 3,
      "potassium": 0,
      "protein": 7,
      "servingSizeType": "Grams",
      "sodium": 0,
      "sugar": 1,
      "active": false
    },
    {
      "id": 29,
      "calories": 70,
      "name": "StringCheese",
      "servingSize": 1,
      "carbs": 1,
      "fat": 4,
      "fiber": 0,
      "potassium": 0,
      "protein": 8,
      "servingSizeType": "Item",
      "sodium": 180,
      "sugar": 0,
      "active": false
    },
    {
      "id": 30,
      "calories": 15,
      "name": "Veggies",
      "servingSize": 28,
      "carbs": 3,
      "fat": 0,
      "fiber": 0,
      "potassium": 0,
      "protein": 0,
      "servingSizeType": "Item",
      "sodium": 0,
      "sugar": 0,
      "active": true
    },
    {
      "id": 11,
      "calories": 80,
      "name": "Apple",
      "servingSize": 1,
      "carbs": 16,
      "fat": 0,
      "fiber": 5,
      "potassium": 0,
      "protein": 0,
      "servingSizeType": "item",
      "sodium": 0,
      "sugar": 16,
      "active": true
    },
    {
      "id": 19,
      "calories": 80,
      "name": "Yasso-Pop",
      "servingSize": 1,
      "carbs": 16,
      "fat": 2,
      "fiber": 1,
      "potassium": 0,
      "protein": 5,
      "servingSizeType": "Item",
      "sodium": 40,
      "sugar": 13,
      "active": false
    },
    {
      "id": 25,
      "calories": 120,
      "name": "Milk Yogurt",
      "servingSize": 225,
      "carbs": 9,
      "fat": 0,
      "fiber": 0,
      "potassium": 250,
      "protein": 22,
      "servingSizeType": "Grams",
      "sodium": 90,
      "sugar": 9,
      "active": false
    },
    {
      "id": 27,
      "calories": 114,
      "name": "SweetPotato",
      "servingSize": 133,
      "carbs": 27,
      "fat": 0,
      "fiber": 4,
      "potassium": 448,
      "protein": 2,
      "servingSizeType": "Grams",
      "sodium": 73,
      "sugar": 6,
      "active": false
    },
    {
      "id": 16,
      "calories": 110,
      "name": "Potatoes",
      "servingSize": 148,
      "carbs": 26,
      "fat": 0,
      "fiber": 2,
      "potassium": 620,
      "protein": 3,
      "servingSizeType": "Grams",
      "sodium": 0,
      "sugar": 1,
      "active": false
    },
    {
      "id": 28,
      "calories": 60,
      "name": "WheatBread",
      "servingSize": 1,
      "carbs": 11,
      "fat": 0,
      "fiber": 2,
      "potassium": 0,
      "protein": 4,
      "servingSizeType": "Item",
      "sodium": 0,
      "sugar": 1,
      "active": false
    },
    {
      "id": 9,
      "calories": 210,
      "name": "Oatmeal",
      "servingSize": 2,
      "carbs": 32,
      "fat": 4,
      "fiber": 6,
      "potassium": 210,
      "protein": 8,
      "servingSizeType": "Item",
      "sodium": 150,
      "sugar": 0,
      "active": false
    },
    {
      "id": 10,
      "calories": 100,
      "name": "LunchMeat",
      "servingSize": 4,
      "carbs": 2,
      "fat": 2,
      "fiber": 0,
      "potassium": 0,
      "protein": 20,
      "servingSizeType": "oz",
      "sodium": 450,
      "sugar": 0,
      "active": false
    },
    {
      "id": 12,
      "calories": 35,
      "name": "Soup",
      "servingSize": 1,
      "carbs": 8,
      "fat": 0,
      "fiber": 4,
      "potassium": 580,
      "protein": 3,
      "servingSizeType": "Item",
      "sodium": 470,
      "sugar": 2,
      "active": true
    },
    {
      "id": 14,
      "calories": 110,
      "name": "Beans",
      "servingSize": 130,
      "carbs": 14,
      "fat": 1,
      "fiber": 6,
      "potassium": 400,
      "protein": 6,
      "servingSizeType": "Grams",
      "sodium": 530,
      "sugar": 2,
      "active": true
    },
    {
      "id": 17,
      "calories": 130,
      "name": "Cheeto-Crunch",
      "servingSize": 28,
      "carbs": 20,
      "fat": 5,
      "fiber": 0,
      "potassium": 60,
      "protein": 2,
      "servingSizeType": "Grams",
      "sodium": 230,
      "sugar": 0,
      "active": false
    },
    {
      "id": 18,
      "calories": 150,
      "name": "Cheeto-Puff",
      "servingSize": 28,
      "carbs": 16,
      "fat": 9,
      "fiber": 0,
      "potassium": 0,
      "protein": 2,
      "servingSizeType": "Grams",
      "sodium": 290,
      "sugar": 1,
      "active": false
    },
    {
      "id": 20,
      "calories": 150,
      "name": "Yasso-Bar",
      "servingSize": 1,
      "carbs": 16,
      "fat": 8,
      "fiber": 1,
      "potassium": 0,
      "protein": 4,
      "servingSizeType": "Item",
      "sodium": 40,
      "sugar": 12,
      "active": false
    },
    {
      "id": 21,
      "calories": 140,
      "name": "Waffles",
      "servingSize": 2,
      "carbs": 27,
      "fat": 3,
      "fiber": 3,
      "potassium": 110,
      "protein": 4,
      "servingSizeType": "Item",
      "sodium": 380,
      "sugar": 3,
      "active": false
    },
    {
      "id": 22,
      "calories": 360,
      "name": "Strudles",
      "servingSize": 2,
      "carbs": 54,
      "fat": 14,
      "fiber": 1,
      "potassium": 0,
      "protein": 4,
      "servingSizeType": "Item",
      "sodium": 360,
      "sugar": 20,
      "active": false
    },
    {
      "id": 23,
      "calories": 80,
      "name": "Banana",
      "servingSize": 1,
      "carbs": 27,
      "fat": 0,
      "fiber": 3,
      "potassium": 422,
      "protein": 1,
      "servingSizeType": "Item",
      "sodium": 1,
      "sugar": 14,
      "active": false
    },
    {
      "id": 24,
      "calories": 100,
      "name": "Cheerios",
      "servingSize": 28,
      "carbs": 20,
      "fat": 2,
      "fiber": 3,
      "potassium": 180,
      "protein": 3,
      "servingSizeType": "Grams",
      "sodium": 140,
      "sugar": 1,
      "active": false
    },
    {
      "id": 99,
      "calories": 35,
      "name": "Rice Cake",
      "servingSize": 1,
      "carbs": 7,
      "fat": 0,
      "fiber": 0,
      "potassium": 30,
      "protein": 0,
      "servingSizeType": "Item",
      "sodium": 15,
      "sugar": 0,
      "active": true
    },
    {
      "id": 100,
      "calories": 110,
      "name": "Yogurt (Coconut)",
      "servingSize": 225,
      "carbs": 12,
      "fat": 7,
      "fiber": 3,
      "potassium": 0,
      "protein": 0,
      "servingSizeType": "Grams",
      "sodium": 50,
      "sugar": 0,
      "active": true
    }
  ] as Food[])
    .filter(f => f.active)
    .sort((first, second) => first.name.charCodeAt(0) - second.name.charCodeAt(0))

const FoodMap = FoodList.reduce((map, curr) => {
  map.set(curr.name, curr)
  return map
}, new Map<string, Food>())
