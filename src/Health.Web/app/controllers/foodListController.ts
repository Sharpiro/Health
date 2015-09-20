class FoodListController
{
    private nutritionTable: Array<IFood>;

    constructor(private scope: any, private nutritionService: NutritionService, private nutritionDataService: NutritionDataService)
    {
        scope.vm = this;
        this.getNutritionData();
    }

    private getNutritionData(forceUpdate?: RequestOptions)
    {
        this.nutritionDataService.GetNutritionTable(forceUpdate).then((data) =>
        {
            this.nutritionTable = data.data;
            return null;
        });
    }

    private addFood(): void
    {
        let sco = this.scope;
        if (!sco.addFoodName || !sco.addFoodCalories) return;
        let food: any = {
            Name: sco.addFoodName,
            ServingSize: sco.addFoodServingSize,
            ServingName: sco.addFoodServingName,
            Calories: sco.addFoodCalories,
            Protein: sco.addFoodProtein,
            Fat: sco.addFoodFat,
            Carbs: sco.addFoodCarbs,
            Sugar: sco.addFoodSugar,
            Fiber: sco.addFoodFiber,
            Sodium: sco.addFoodSodium,
            Potassium: sco.addFoodPotassium
        };
        this.nutritionService.addFood(food).then((data) =>
        {
            this.getNutritionData(RequestOptions.Force);
            this.clearTextboxes();
            this.successCallBack(data);
            return null;
        }, this.errorCallBack);
    };

    private clearTextboxes(): void
    {
        this.scope.addFoodName = undefined;
        this.scope.addFoodServingSize = "";
        this.scope.addFoodServingName = "";
        this.scope.addFoodCalories = "";
        this.scope.addFoodProtein = "";
        this.scope.addFoodFat = "";
        this.scope.addFoodCarbs = "";
        this.scope.addFoodSugar = "";
        this.scope.addFoodFiber = "";
        this.scope.addFoodSodium = "";
        this.scope.addFoodPotassium = "";
    }

    private testing(index: number): void
    {
        console.log(index);
        var food = this.nutritionTable[index];
        this.scope.addFoodName = food.Name;
        this.scope.addFoodServingSize = food.ServingSize;
        this.scope.addFoodServingName = food.ServingName;
        this.scope.addFoodCalories = food.Calories;
        this.scope.addFoodProtein = food.Protein;
        this.scope.addFoodFat = food.Fat;
        this.scope.addFoodCarbs = food.Carbs;
        this.scope.addFoodSugar = food.Sugar;
        this.scope.addFoodFiber = food.Fiber;
        this.scope.addFoodSodium = food.Sodium;
        this.scope.addFoodPotassium = food.Potassium;
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

app.controller("foodListController", ["$scope", "nutritionService", "nutritionDataService", FoodListController]);