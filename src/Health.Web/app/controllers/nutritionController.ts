///<reference path="../../Lib/definitelyTyped/toastr/toastr.d.ts"/>

class NutritionController
{
    private nutritionData: Array<IFood>;
    private currentDay: ICurrentDay;
    private activeFood: IFood;
    private dropDownFoodId: number = 6;
    private nextMeal: IMeal;
    private dayTotals: any;
    private debugObj: any = {};

    constructor(private scope: any, private nutritionService: NutritionService, private nutritionDataService: NutritionDataService)
    {
        scope.vm = this;
        this.getNutritionTable();
        this.getMostRecentDay();
        //this.getAllData();
    }

    private getAllData(): void
    {
        this.nutritionService.getAllData().then(this.successCallBack, this.errorCallBack);
    }

    private getNutritionTable(): void
    {
        this.nutritionDataService.GetNutritionTable().then((data) =>
        {
            this.nutritionData = data.data;
            this.selectRandomFood();
            return this.successCallBack(data);
        }, this.errorCallBack);
    }

    private dropDownUpdate(currentDropdownFoodId: number): void
    {
        for (var food of this.nutritionData)
        {
            if (food.Id === currentDropdownFoodId)
            {
                this.activeFood = new Food(food);
                return;
            }
        }
    }

    private getMostRecentDay(forceUpdate?: RequestOptions): void
    {
        this.nutritionDataService.getMostRecentDay(forceUpdate).then((data) =>
        {
            this.currentDay = data.data;
            this.nutritionService.getDayTotals().then((innerData) =>
            {
                this.dayTotals = innerData.data;
                this.successCallBack(innerData);
            });
            return this.successCallBack(data);
        }, this.errorCallBack);
    }

    private addDay(): void
    {
        this.nutritionService.addDay().then((data) =>
        {
            this.getMostRecentDay(RequestOptions.Force);
            return this.successCallBack(data, "Successfully Added day.");
        }, this.errorCallBack);
    }

    private clearDay(): void
    {
        this.nutritionService.clearDay().then((data) =>
        {
            this.getMostRecentDay(RequestOptions.Force);
            return this.successCallBack(data, "Successfully cleared day.");
        }, this.errorCallBack);
    }


    private deleteDay(): void
    {
        this.nutritionService.deleteDay(this.currentDay.DayId).then((data) =>
        {
            this.getMostRecentDay(RequestOptions.Force);
            return this.successCallBack(data, "Successfully deleted day.");
        }, this.errorCallBack);
    }

    private deleteInvalidDays(): void
    {
        this.nutritionService.deleteInvalidDays().then((data) =>
        {
            this.getMostRecentDay(RequestOptions.Force);
            return this.successCallBack(data, "Successfully deleted invalid days.");
        }, this.errorCallBack);
    }

    private addFood(currentDropdownFoodId: number, foodCalories: number): void
    {
        if (currentDropdownFoodId === undefined || foodCalories === null)
        {
            toastr.error("Error: Please select a food");
            return;
        }
        if (!this.nextMeal)
        {
            this.nextMeal = new Meal();
            this.nextMeal.date = this.currentDay.Date;
        }
        this.nextMeal.calories += foodCalories;
        this.nextMeal.mealEntries.push({
            FoodId: currentDropdownFoodId,
            Calories: foodCalories,
            MealEntryNumber: this.nextMeal.mealEntries.length + 1
        });
        this.selectRandomFood();
        console.log(this.nextMeal.mealEntries);
    }

    private saveDay(): void
    {
        if (!this.nextMeal)
        {
            toastr.error("Error: Please enter a food");
            return;
        }
        this.nextMeal.mealNumber = this.currentDay.Meals.length + 1;
        console.log(`Next Meal Number: ${this.nextMeal.mealNumber}`);
        this.nutritionService.addMeal(this.nextMeal).then((data) =>
        {
            this.getMostRecentDay(RequestOptions.Force);
            this.nextMeal = undefined;
            this.successCallBack(data, "Successfully Saved Day!");
            return null;
        }, this.errorCallBack);
    }

    private selectRandomFood(): void
    {
        const maxValue = this.nutritionData.length;
        const randomNumber = Math.floor(Math.random() * maxValue);
        const randomFood = this.nutritionData[randomNumber];
        this.activeFood = new Food(randomFood);
        this.dropDownFoodId = this.activeFood.Id;
    }

    private clearNextMeal(): void
    {
        this.nextMeal = undefined;
    }

    public updateServing(foodId: number, calories: number)
    {
        for (var food of this.nutritionData)
        {
            if (food.Id === foodId)
            {
                let servingsPerCaloorie = food.ServingSize / food.Calories;
                this.activeFood.ServingSize = servingsPerCaloorie * calories;
                return;
            }
        }
    }

    public updateCalories(foodId: number, servingSize: number)
    {
        for (var food of this.nutritionData)
        {
            if (food.Id === foodId)
            {
                let caloriesPerServing = food.Calories / food.ServingSize;
                this.activeFood.Calories = caloriesPerServing * servingSize;
                return;
            }
        }
    }

    private successCallBack = (data: any, message?: string): any =>
    {
        this.debugObj.data = data.data;
        this.debugObj.message = `${data.status}: ${data.statusText}`;
        if (message)
            toastr.success(message);
        return null;
    }

    private errorCallBack = (error: any): void =>
    {
        this.debugObj.message = `${error.status}: ${error.statusText}`;
        this.debugObj.data = error.data;
        console.log(error);
        toastr.error(`Error: ${error.data}`);
    }
}

app.controller("nutritionController", ["$scope", "nutritionService", "nutritionDataService", NutritionController]);