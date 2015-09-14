class NutritionController
{
    constructor(private scope: any, private nutritionService: NutritionService)
    {
        scope.vm = this;
        this.getMostRecentDay();
    }

    private getMostRecentDay() {
        this.nutritionService.getMostRecentDay().then(this.successCallBack, this.errorCallBack);
    }

    private addFood(foodName: string, foodCalories: number, foodServingSize: number)
    {
        this.nutritionService.addFood(foodName, foodCalories, foodServingSize).then(this.successCallBack, this.errorCallBack);
    }

    private addMealEntry(food: string, calories: number, mealId: number)
    {
        this.nutritionService.addMealEntry(food, calories, mealId).then(this.successCallBack, this.errorCallBack);
    }

    private addMeal(mealNumber: number)
    {
        var today = new Date();
        var date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), -4);
        this.nutritionService.addMeal(date, mealNumber).then(this.successCallBack, this.errorCallBack);
    }

    private addDay()
    {
        this.nutritionService.addDay().then(this.successCallBack, this.errorCallBack);
    }

    private clearMessage()
    {
        this.scope.message = "";
    }

    private successCallBack = (data: any): any =>
    {
        console.log(data);
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