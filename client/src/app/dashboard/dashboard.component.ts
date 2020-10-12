import { Component, OnInit } from "@angular/core";
import { Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { Meal } from "../models/meal";
import { MealEntry } from "../models/mealEntry";
// import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { MatDialog } from "@angular/material/dialog";
import { CustomSelectComponent } from "../custom-select/custom-select.component";
import { ConfirmationComponentComponent } from "../confirmation-component/confirmation-component.component";
import { MoreOptionsComponent } from "../more-options/more-options.component";
import { Food, GroupedFood } from "../shared/foods/food";
import { FoodService } from "../shared/foods/food.service";
import { exportText } from "../shared/foods/helpers";
import { settings } from "../settings/settings";
import { environment } from "src/environments/environment";
import { TypedFormControl } from "../shared/typed_form_control";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  isScrollable = false;
  meals: Meal[] = [];
  displayedColumns: string[] = ["foodName", "calories", "ss"];
  currentMealEntriesDataSource = new MatTableDataSource<MealEntry>();
  mealEntryCalorieFormControl = new TypedFormControl("", [Validators.required]);
  mealEntryServingSizeFormControl = new TypedFormControl(
    "",
    [Validators.required],
  );
  foodFormControl = new TypedFormControl<Food>();
  currentMealCaloriesControl = new TypedFormControl("", [Validators.required]);
  allMealsCaloriesControl = new TypedFormControl("", [Validators.required]);
  foodList: Food[] = [];
  groupedFoodsList: GroupedFood[] = [];
  allFoodList: (Food | GroupedFood)[] = [];
  settings;
  isDebug = !environment.production;

  constructor(
    readonly snackBar: MatSnackBar,
    readonly dialog: MatDialog,
    readonly foodService: FoodService,
  ) {
    this.settings = settings;
  }

  async ngOnInit() {
    try {
      this.foodList = await this.foodService.getFoodList(
        this.settings.showAllFoods,
      );
      // this.groupedFoodsList = await this.foodService.getGroupedFoods()
      this.allFoodList = [...this.foodList, ...this.groupedFoodsList];

      const mealEntriesJson = localStorage.getItem("mealEntries");
      this.currentMealEntriesDataSource.data = mealEntriesJson
        ? JSON.parse(mealEntriesJson)
        : [];

      const mealsJson = localStorage.getItem("meals");
      this.meals = mealsJson ? JSON.parse(mealsJson) : [];

      this.foodFormControl.valueChangesTyped.subscribe(this.onFoodChanges);

      this.updateAggregateCalories();

      this.foodFormControl.setValueTyped(this.getRandomFood());
    } catch (err) {
      this.snackBar.open(err);
    }
  }

  onAddFood() {
    if (!this.foodFormControl.valueTyped) {
      this.snackBar.open("Enter valid food", "OK", {
        duration: 2000,
      });
      return;
    }

    const dayTimestamp = localStorage.getItem("dayTimestamp");
    if (!dayTimestamp) {
      localStorage.setItem("dayTimestamp", new Date().toISOString());
    }

    const food: Food = this.foodFormControl.valueTyped;
    const currentMealEntries = this.currentMealEntriesDataSource.data;
    currentMealEntries.push({
      foodName: food.name,
      calories: +this.mealEntryCalorieFormControl.valueTyped,
      servingSize: +this.mealEntryServingSizeFormControl.valueTyped,
    });
    this.currentMealEntriesDataSource = new MatTableDataSource(
      currentMealEntries,
    );
    localStorage.setItem("mealEntries", JSON.stringify(currentMealEntries));
    this.updateAggregateCalories();
  }

  onSaveMeal() {
    if (this.currentMealEntriesDataSource.data.length === 0) {
      this.snackBar.open("Enter Meal Information", "OK", { duration: 2000 });
      return;
    }
    const newMeal = new Meal(this.currentMealEntriesDataSource.data);
    this.meals.push(newMeal);
    this.currentMealEntriesDataSource = new MatTableDataSource();
    localStorage.removeItem("mealEntries");
    localStorage.setItem("meals", JSON.stringify(this.meals));
    this.updateAggregateCalories();
  }

  onClearMeal() {
    this.currentMealEntriesDataSource = new MatTableDataSource();
    localStorage.removeItem("mealEntries");
    this.updateAggregateCalories();
  }

  onClearDay() {
    const dialogRef = this.dialog.open(ConfirmationComponentComponent, {
      width: "350px",
      data: "Are you sure you want to clear the day?",
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (!result) return;

      this.onClearMeal();
      this.meals = [];
      localStorage.removeItem("meals");
      localStorage.removeItem("dayTimestamp");
      this.updateAggregateCalories();
    });
  }

  onFoodChanges = (food: Food) => {
    if (!food) return;

    this.mealEntryCalorieFormControl.setValueTyped(food.calories.toString());
    this.mealEntryServingSizeFormControl.setValueTyped(
      food.servingSize.toString(),
    );
  };

  onReturnKey(event: any) {
    if (event.key === "Enter") {
      this.onAddFood();
      event.target.blur();
    }
  }

  onServingSizeChange = () => {
    const food: Food = this.foodFormControl.valueTyped;
    const mealEntryServingSize: number = +this.mealEntryServingSizeFormControl
      .valueTyped;
    const caloriesPerOneOfServingType = food.calories / food.servingSize;
    const mealEntryCalories = Math.ceil(
      mealEntryServingSize * caloriesPerOneOfServingType,
    );
    this.mealEntryCalorieFormControl.setValueTyped(
      mealEntryCalories.toString(),
    );
  };

  onCaloriesChange = () => {
    const food: Food = this.foodFormControl.valueTyped;
    const mealEntryCalories = +this.mealEntryCalorieFormControl.valueTyped;
    const caloriesPerOneOfServingType = food.calories / food.servingSize;
    const mealEntryServingSize = mealEntryCalories /
      caloriesPerOneOfServingType;
    this.mealEntryServingSizeFormControl.setValueTyped(
      mealEntryServingSize.toFixed(2),
    );
  };

  onFoodClick() {
    const dialogRef = this.dialog.open(CustomSelectComponent, {
      height: "500px",
      data: this.allFoodList,
    });

    dialogRef.afterClosed().subscribe(
      (foodOrGroupedFood: Food | GroupedFood) => {
        if (!foodOrGroupedFood) return;

        if ("foods" in foodOrGroupedFood) {
          const currentMealEntries = this.currentMealEntriesDataSource.data;
          for (const food of foodOrGroupedFood.foods) {
            currentMealEntries.push({
              foodName: food.name,
              calories: food.calories,
              servingSize: food.servingSize,
            });
          }
          this.currentMealEntriesDataSource = new MatTableDataSource(
            currentMealEntries,
          );
          localStorage.setItem(
            "mealEntries",
            JSON.stringify(currentMealEntries),
          );
          this.updateAggregateCalories();
        } else {
          if (foodOrGroupedFood.name === "Other") {
            const foodName = (prompt("food name") ?? "").trim();
            if (!foodName) return;
            foodOrGroupedFood.name = foodName;
            console.log(foodName);
          }
          this.foodFormControl.setValueTyped(foodOrGroupedFood);
        }
      },
    );
  }

  onMoreOptions() {
    const dialogRef = this.dialog.open(MoreOptionsComponent, {
      width: "350px",
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      if (!result) return;

      switch (result) {
        case "exportToFile":
          this.exportToFile();
          break;
        case "exportToServer":
          this.exportToServer();
          break;
        case "scroll":
          this.onScrollToggle();
          break;
        case "debug":
          this.onDebug();
          break;
      }
    });
  }

  exportToFile() {
    const exportObj = {
      days: JSON.parse(localStorage.getItem("days") ?? "[]"),
      logs: JSON.parse(localStorage.getItem("logs") ?? "[]"),
    };
    const filename = `${new Date().toISOString()}_health_export.json.txt`;
    exportText(filename, JSON.stringify(exportObj));
  }

  exportToServer() {
    const exportObj = {
      days: JSON.parse(localStorage.getItem("days") ?? "[]"),
      logs: JSON.parse(localStorage.getItem("logs") ?? "[]"),
    };
    fetch(`${environment.server}/healthExportSmart`, {
      body: JSON.stringify(exportObj),
      method: "POST",
      headers: [
        ["content-type", "application/json"],
        ["token", this.settings.token],
      ],
    }).then((res) => {
      return res.text().then((msg) => {
        if (!res.ok) {
          throw new Error(msg);
        }
        this.snackBar.open(`Upload success: ${msg}`, "OK", { duration: 3000 });
      });
    }).catch((err) => {
      this.snackBar.open(`Upload failed: ${err}`, "OK", { duration: 3000 });
      console.log(err);
    });
  }

  onDebug() {
    this.exportToServer();
  }

  onScrollToggle() {
    // if (this.isScrollable) {
    //   disableBodyScroll(document.body)
    // } else {
    //   enableBodyScroll(document.body)
    // }
    // this.isScrollable = !this.isScrollable
  }

  private getRandomFood(): Food {
    // const randomIndex = Math.floor(Math.random() * FoodList.length)
    // return FoodList[randomIndex]
    return this.foodList[0];
  }

  private updateAggregateCalories() {
    const currentMealEntriesSum = this.currentMealEntriesDataSource.data.reduce(
      (prev, curr) => prev + curr.calories,
      0,
    );
    const mealsSum = this.meals.reduce((prev, curr) => prev + curr.calories, 0);
    const totalCalories = currentMealEntriesSum + mealsSum;
    this.currentMealCaloriesControl.setValueTyped(
      currentMealEntriesSum.toString(),
    );
    this.allMealsCaloriesControl.setValueTyped(totalCalories.toString());
  }
}
