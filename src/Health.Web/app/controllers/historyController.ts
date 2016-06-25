class HistoryController
{
    private nutritionTable: Array<IFood>;
    private history = {
        Days: [{ Calories: 2200 }, { Calories: 1900 }, { Calories: 2500 }, { Calories: 3000 }, { Calories: 1800 }
            , { Calories: 2500 }, { Calories: 2200 }],
        Average: 0
    };
    private temp = 12;
    private graphHeight = 150;
    private yOffset = 5;

    constructor(private scope: any, private nutritionService: NutritionService, private nutritionDataService: NutritionDataService)
    {
        scope.vm = this;
        scope.test = "angular testing..."
        this.getHistory(7);
    }

    private getHistory(days: number)
    {
        this.nutritionService.getNutritionHistory(days).then((data) => this.history = data.data);
    }

    private getStartY(item: any): number
    {
        var value = (this.graphHeight + this.yOffset) - this.getHeight(item);
        return value;
    }

    private getHeight(item: any): number
    {
        var temp = this.history.Days.map(obj => obj.Calories);
        var value = (this.graphHeight / Math.max.apply(null, temp)) * item.Calories;
        return value;
    }
}

app.controller("historyController", ["$scope", "nutritionService", "nutritionDataService", HistoryController]);