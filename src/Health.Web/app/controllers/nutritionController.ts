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

    constructor(private scope: any, private nutritionService: NutritionService,
        private nutritionDataService: NutritionDataService, private _responseService: ResponseService)
    {
        scope.vm = this;
        this.getNutritionTable();
        this.getMostRecentDay();
        this.loadMealFromCache();
    }

    private loadMealFromCache()
    {
        var temp = this.nutritionData;
        var data = localStorage.getItem("nextMeal");
        if (!data) return;
        this.nextMeal = JSON.parse(data);
    }

    private getAllData(): void
    {
        this.nutritionService.getAllData().then(this._responseService.successCallBack, this._responseService.errorCallBack);
    }

    private getNutritionTable(): void
    {
        this.nutritionDataService.GetNutritionTable().then((data) =>
        {
            this.nutritionData = data.data;
            this.selectRandomFood();
        }, this._responseService.errorCallBack);
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
            });
        }, this._responseService.errorCallBack);
    }

    private addDay(): void
    {
        this.nutritionService.addDay().then((data) =>
        {
            this.getMostRecentDay(RequestOptions.Force);
            return this._responseService.successCallBack(data, "Successfully Added day.");
        }, this._responseService.errorCallBack);
    }

    private clearDay(): void
    {
        this.nutritionService.clearDay().then((data) =>
        {
            this.clearNextMeal();
            this.getMostRecentDay(RequestOptions.Force);
            return this._responseService.successCallBack(data, "Successfully cleared day.");
        }, this._responseService.errorCallBack);
    }


    private deleteInvalidDays(): void
    {
        this.nutritionService.deleteInvalidDays().then((data) =>
        {
            this.getMostRecentDay(RequestOptions.Force);
            return this._responseService.successCallBack(data, "Successfully deleted invalid days.");
        }, this._responseService.errorCallBack);
    }

    private addFood(currentDropdownFoodId: number, foodCalories: number): void
    {
        if (!currentDropdownFoodId || !foodCalories)
        {
            toastr.error("Error: Please select a food");
            return;
        }
        if (!this.nextMeal)
        {
            this.nextMeal = new Meal();
            this.nextMeal.date = this.currentDay.Date;
        }
        if (!this.nextMeal.mealNumber)
            this.nextMeal.mealNumber = this.currentDay.Meals.length + 1;
        this.nextMeal.calories += foodCalories;
        this.nextMeal.mealEntries.push({
            FoodId: currentDropdownFoodId,
            Calories: foodCalories,
            MealEntryNumber: this.nextMeal.mealEntries.length + 1
        });
        localStorage.setItem("nextMeal", angular.toJson(this.nextMeal));
        this.selectRandomFood();
    }

    private saveDay(): void
    {
        if (!this.nextMeal)
        {
            toastr.error("Error: Please enter a food");
            return;
        }
        this.nutritionService.addMeal(this.nextMeal).then((data) =>
        {
            this.getMostRecentDay(RequestOptions.Force);
            this.clearNextMeal();
            this._responseService.successCallBack(data, "Successfully Saved Day!");
            return null;
        }, this._responseService.errorCallBack);
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
        localStorage.removeItem("nextMeal");
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
                let calories = caloriesPerServing * servingSize
                console.log(calories);
                this.activeFood.Calories = Math.ceil(calories);
                return;
            }
        }
    }
}

app.controller("nutritionController", ["$scope", "nutritionService", "nutritionDataService", "responseService", NutritionController]);