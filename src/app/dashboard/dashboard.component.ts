import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = ['foodName', 'calories'];
  foods = FoodDatabaseList
  mealsDataSource = new MatTableDataSource<Meal>();
  calorieFormControl = new FormControl('', [Validators.required]);
  servingSizeFormControl = new FormControl('', [Validators.required]);
  foodFormControl = new FormControl('', [Validators.required]);
  totalCaloriesControl = new FormControl('', [Validators.required]);

  constructor(public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.foodFormControl.valueChanges.subscribe(this.onFoodChanges)
    this.totalCaloriesControl.setValue(0)
    this.foodFormControl.setValue(this.getRandomFood())
  }

  onSubmit() {
    if (!this.foodFormControl.value) {
      this.snackBar.open("Enter valid food", "OK", {
        duration: 2000,
      });
      return
    }
    if (this.calorieFormControl.value <= 0) {
      this.snackBar.open("Enter valid calories", "OK", {
        duration: 2000,
      });
      return
    }

    const food = this.foodFormControl.value
    const data = this.mealsDataSource.data
    data.push({ foodId: food.id, foodName: food.name, calories: this.calorieFormControl.value })
    this.mealsDataSource = new MatTableDataSource(data)

    // this.meals.push({ foodId: food.id, foodName: food.name, calories: this.calorieFormControl.value })
    this.totalCaloriesControl.setValue(this.totalCaloriesControl.value + this.calorieFormControl.value)
  }

  getRandomFood(): Food {
    const randomIndex = Math.floor(Math.random() * FoodDatabaseList.length)
    return FoodDatabaseList[randomIndex]
  }

  onFoodChanges = (food: Food) => {
    if (!food) return

    this.calorieFormControl.setValue(food.calories)
    this.servingSizeFormControl.setValue(food.servingSize)
  }
}

export interface Meal {
  foodId: number
  foodName: string
  calories: number
}

export interface Food {
  id: number
  name: string
  calories: number
  servingSize: number,
  servingSizeType: "Grams" | "Egg"
}

const FoodDatabaseList: Food[] = [
  { id: 1, name: "Chicken", calories: 100, servingSize: 4, servingSizeType: "Grams" },
  { id: 2, name: "Eggs", calories: 70, servingSize: 1, servingSizeType: "Egg" }
]

const FoodDatabaseMap = {
  1: { id: 1, name: "Chicken", calories: 100, servingSize: 4, servingSizeType: "Grams" },
  2: { id: 2, name: "Eggs", calories: 70, servingSize: 1, servingSizeType: "Egg" }
}
