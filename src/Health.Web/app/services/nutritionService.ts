class NutritionService
{
    constructor(private $http: ng.IHttpService)
    {

    }

    public addFood(foodName: string, foodCalories: number, foodServingSize: number): ng.IPromise<any>
    {
        var data = { name: foodName, calories: foodCalories, servingSize: foodServingSize};
        return this.$http.post("/api/nutrition/addfood", data);
    }

    public addMealEntry(food: string, calories: number): ng.IPromise<any>
    {
        var data = {calories: calories};
        return this.$http.post("/api/nutrition/addmealentry", data);
    }
}

app.service("nutritionService", ["$http", NutritionService]);