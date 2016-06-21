class HistoryController
{
    private nutritionTable: Array<IFood>;
    private array = [{ calories: 2200 }, { calories: 1900 }, { calories: 2500 }, { calories: 3000 }, { calories: 1800 }
        , { calories: 2500 }, { calories: 2200 }];
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
        this.nutritionService.getNutritionHistory(days).then((data) => this.array = data.data);
    }

    private getStartY(item: any): number
    {
        var value = (this.graphHeight + this.yOffset) - this.getHeight(item);
        return value;
    }

    private getHeight(item: any): number
    {
        var temp = this.array.map(obj => obj.calories);
        var value = (this.graphHeight / Math.max.apply(null, temp)) * item.calories;
        return value;
    }
}

app.controller("historyController", ["$scope", "nutritionService", "nutritionDataService", HistoryController]);