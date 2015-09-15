class NutritionService
{
    constructor(private $http: ng.IHttpService)
    {

    }

    public getMostRecentDay(): ng.IPromise<any>
    {
        return this.$http.get("/api/nutrition/getmostrecentday");
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

    public addMeal(date: Date, mealNumber: number): ng.IPromise<any>
    {
        var data = { date: date, mealNumber: mealNumber };
        return this.$http.post("/api/nutrition/addmeal", data);
    }

    public addDay(): ng.IPromise<any>
    {
        var data = {};
        return this.$http.post("/api/nutrition/addday", data);
    }

    public saveDay(meal: IMeal): ng.IPromise<any>
    {
        return this.$http.post("/api/nutrition/saveday", meal);
    }
}

app.service("nutritionService", ["$http", NutritionService]);