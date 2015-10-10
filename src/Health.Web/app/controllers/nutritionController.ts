///<reference path="../../Lib/definitelyTyped/toastr/toastr.d.ts"/>

class NutritionController
{
    private nutritionData: Array<IFood>;
    private currentDay: ICurrentDay;
    private nextMeal: IMeal;
    private dayTotals: any;

    constructor(private scope: any, private nutritionService: NutritionService, private nutritionDataService: NutritionDataService)
    {
        scope.vm = this;
        this.getNutritionTable();
        this.getMostRecentDay();
        scope.editMode = true;
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
        this.nutritionData.forEach((value) =>
        {
            if (value.Id === currentDropdownFoodId)
                this.scope.finalCalories = value.Calories;
        });
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

    private addFood(currentDropdownFoodId: number, finalCalories: number): void
    {
        if (currentDropdownFoodId === undefined || finalCalories === null)
        {
            toastr.error("Error: Please select a food");
            return;
        }
        if (!this.nextMeal)
        {
            this.nextMeal = new Meal();
            this.nextMeal.date = this.currentDay.Date;
        }
        this.nextMeal.mealEntries.push({
            FoodId: currentDropdownFoodId,
            Calories: finalCalories,
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
        var maxValue = this.nutritionData.length;
        var randomNumber = Math.floor(Math.random() * maxValue);
        var randomFood = this.nutritionData[randomNumber];
        this.scope.finalCalories = randomFood.Calories;
        this.scope.currentDropdownFoodId = randomFood.Id;
    }

    private clearSelection(): void
    {
        this.scope.finalCalories = undefined;
        this.scope.currentDropdownFoodId = undefined;
    }

    private clearNextMeal(): void
    {
        this.nextMeal = undefined;
    }

    private successCallBack = (data: any, message?: string): any =>
    {
        this.scope.data = data.data;
        this.scope.message = `${data.status}: ${data.statusText}`;
        if (message)
            toastr.success(message);
        return null;
    }

    private errorCallBack = (error: any): void =>
    {
        this.scope.message = `${error.status}: ${error.statusText}`;
        this.scope.data = error.data;
        console.log(error);
        toastr.error(`Error: ${error.data}`);
    }
}

app.controller("nutritionController", ["$scope", "nutritionService", "nutritionDataService", NutritionController]);