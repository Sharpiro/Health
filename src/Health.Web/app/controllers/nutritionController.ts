class NutritionController
{
    private nutritionData: Array<IFood>;
    private currentDay: ICurrentDay;
    private nextMeal: IMeal;

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
            this.scope.message = `${data.status}: ${data.statusText}`;
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

    private addDay(): void
    {
        this.nutritionService.addDay().then(this.successCallBack, this.errorCallBack);
    }

    private clearDay(): void
    {
        this.nutritionService.clearDay().then(this.successCallBack, this.errorCallBack);
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
        this.selectRandomFood();
        console.log(this.nextMeal.mealEntries);
    }

    private saveDay(): void
    {
        this.nextMeal.mealNumber = this.currentDay.Meals.length + 1;
        console.log(`Next Meal Number: ${this.nextMeal.mealNumber}`);
        this.nutritionService.addMeal(this.nextMeal).then(this.successCallBack, this.errorCallBack);
    }

    private selectRandomFood() {
        var maxValue = this.nutritionData.length;
        var randomNumber = Math.floor(Math.random() * maxValue);
        var randomFood = this.nutritionData[randomNumber];
        this.scope.finalCalories = randomFood.Calories;
        this.scope.currentDropdownFoodId = randomFood.Id;
    }

    private testing(index: number) {
        console.log(index);
        console.log("testing...");
        this.scope.editMode = !this.scope.editMode;
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

app.controller("nutritionController", ["$scope", "nutritionService", "nutritionDataService", NutritionController]);