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

    public getDayTotals(): ng.IPromise<any>
    {
        return this.$http.get("/api/nutrition/getdaytotals");
    }

    public getNutritionTable(): ng.IPromise<any>
    {
        return this.$http.get("/api/nutrition/getnutritiontable");
    }

    public addFood(food: any): ng.IPromise<any>
    {
        return this.$http.post("/api/nutrition/addfood", food);
    }

    public addMeal(meal: IMeal): ng.IPromise<any>
    {
        return this.$http.post("/api/nutrition/addmeal", meal);
    }

    public addDay(): ng.IPromise<any>
    {
        const data = {};
        return this.$http.post("/api/nutrition/addday", data);
    }

    public clearDay(): ng.IPromise<any>
    {
        const data = {};
        return this.$http.post("/api/nutrition/clearday", data);
    }

    public deleteDay(dayId: number): ng.IPromise<any>
    {
        return this.$http.delete(`/api/nutrition/deleteday/${dayId}`);
    }

    public deleteInvalidDays(): ng.IPromise<any>
    {
        const data = {};
        return this.$http.post("/api/nutrition/deleteinvaliddays", data);
    }
}

app.service("nutritionService", ["$http", NutritionService]);