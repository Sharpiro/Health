class NutritionController
{
    constructor(private scope: any, private nutritionService: NutritionService)
    {
        scope.vm = this;
    }

    private addFood(addFoodName: string, addFoodCalories: number, addFoodServingSize: number)
    {
        this.nutritionService.addFood(addFoodName, addFoodCalories, addFoodServingSize).then((data) =>
        {
            console.log(data);
            this.scope.message = `${data.status}: ${data.statusText}`;
            this.scope.data = data.data;
            return null;
        }, (error) =>
            {
                this.scope.message = `${error.status}: ${error.statusText}`;
                this.scope.data = error.data;
                console.log(error);
            });
    }

    private addMealEntry(food: string, calories: number)
    {
        this.nutritionService.addMealEntry(food, calories).then((data) =>
        {
            console.log(data);
            this.scope.message = `${data.status}: ${data.statusText}`;
            this.scope.message = data.data;
            return null;
        }, (error) =>
            {
                this.scope.message = `${error.status}: ${error.statusText}`;
                console.log(error);
            });
    }

    private clearMessage()
    {
        this.scope.message = "";
    }
}

app.controller("nutritionController", ["$scope", "nutritionService", NutritionController]);