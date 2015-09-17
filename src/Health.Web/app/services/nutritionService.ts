class NutritionService
{
    constructor(private $http: ng.IHttpService)
    {

    }

    public getAllData(): ng.IPromise<any>
    {
        return this.$http.get("/api/nutrition/getalldata");
    }

    public getMostRecentDay(): ng.IPromise<any>
    {
        return this.$http.get("/api/nutrition/getmostrecentday");
    }

    public getNutritionTable(): ng.IPromise<any>
    {
        return this.$http.get("/api/nutrition/getnutritiontable");
    }

    public addFood(name: string, calories: number, servingSize: number): ng.IPromise<any>
    {
        var data = { name: name, calories: calories, servingSize: servingSize };
        return this.$http.post("/api/nutrition/addfood", data);
    }

    public addMealEntry(food: string, calories: number, mealId: number): ng.IPromise<any>
    {
        var data = { foodName: food, calories: calories, mealId: mealId };
        return this.$http.post("/api/nutrition/addmealentry", data);
    }

    public addMeal(meal: IMeal): ng.IPromise<any>
    {
        return this.$http.post("/api/nutrition/addmeal", meal);
    }

    public addDay(): ng.IPromise<any>
    {
        var data = {};
        return this.$http.post("/api/nutrition/addday", data);
    }
}

app.service("nutritionService", ["$http", NutritionService]);