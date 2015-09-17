class NutritionController
{
    private nutritionData: Array<IFood>;
    private currentDay: ICurrentDay;
    private nextMeal: IMeal;

    constructor(private scope: any, private nutritionService: NutritionService)
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
        this.nutritionService.getNutritionTable().then((data) =>
        {
            this.nutritionData = data.data;
            this.scope.message = `${data.status}: ${data.statusText}`;
        }, this.errorCallBack);
    }

    private dropDownUpdate(currentDropdownFood: IFood): void
    {
        console.log(currentDropdownFood);
    }

    private getMostRecentDay(): void
    {
        this.nutritionService.getMostRecentDay().then((data) =>
        {
            this.currentDay = data.data;
            this.scope.message = `${data.status}: ${data.statusText}`;
            this.scope.data = data.data;
            console.log(this.currentDay);
        }, this.errorCallBack);
    }

    private addFood(foodName: string, foodCalories: number, foodServingSize: number): void
    {
        this.nutritionService.addFood(foodName, foodCalories, foodServingSize).then(this.successCallBack, this.errorCallBack);
    }

    private addMealEntry(food: string, calories: number, mealId: number): void
    {
        this.nutritionService.addMealEntry(food, calories, mealId).then(this.successCallBack, this.errorCallBack);
    }

    private addMeal(mealNumber: number): void
    {
        var today = new Date();
        var tempDate = this.currentDay.Date;
        var date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours());
        //this.nutritionService.addMeal(date, mealNumber).then(this.successCallBack, this.errorCallBack);
        alert("not working...");
        console.log("doing nothing...");
    }

    private addDay(): void
    {
        this.nutritionService.addDay().then(this.successCallBack, this.errorCallBack);
    }

    private addFoodFinal(currentDropdownFoodId: number, finalCalories: number): void
    {
        if (!this.nextMeal)
        {
            this.nextMeal = new Meal();
            this.nextMeal.date = this.currentDay.Date;
        }
        this.nextMeal.mealEntries.push({
            foodId: currentDropdownFoodId,
            calories: finalCalories,
            mealEntryNumber: this.nextMeal.mealEntries.length + 1
        });
        console.log(this.nextMeal.mealEntries);
    }

    private saveDay(): void
    {
        this.nextMeal.mealNumber = this.currentDay.Meals.length + 1;
        console.log(`Next Meal Number: ${this.nextMeal.mealNumber}`);
        this.nutritionService.addMeal(this.nextMeal).then(this.successCallBack, this.errorCallBack);
    }

    private clearMessage()
    {
        this.scope.message = "";
    }

    private successCallBack = (data: any): any =>
    {
        console.log(data.data);
        this.scope.message = `${data.status}: ${data.statusText}`;
        this.scope.data = data.data;
        return null;
    }

    private errorCallBack = (error: any): any =>
    {
        this.scope.message = `${error.status}: ${error.statusText}`;
        this.scope.data = error.data;
        console.log(error);
    }
}

app.controller("nutritionController", ["$scope", "nutritionService", NutritionController]);