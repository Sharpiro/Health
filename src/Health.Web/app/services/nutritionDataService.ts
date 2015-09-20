class NutritionDataService
{
    private nutritionTable: Array<IFood>;

    constructor(private $q: ng.IQService, private nutritionService: NutritionService)
    {

    }

    public GetNutritionTable(forceUpdate?: RequestOptions): ng.IPromise<any>
    {
        var dfd = this.$q.defer();
        if (!this.nutritionTable || forceUpdate === RequestOptions.Force)
        {
            this.nutritionService.getNutritionTable().then((data) =>
            {
                var returnData = { data: data.data };
                this.nutritionTable = returnData.data;
                dfd.resolve(returnData);
                return null;
            });
        }
        else
        {
            dfd.resolve(this.nutritionTable);
        }
        return dfd.promise;
    }

    public getFoodById(foodId: number): string
    {
        var food: string;
        this.nutritionTable.forEach((value) =>
        {
            if (value.Id === foodId)
                food = value.Name;
        });
        return food;
    }
}

app.service("nutritionDataService", ["$q", "nutritionService", NutritionDataService])

enum RequestOptions
{
    Force
}