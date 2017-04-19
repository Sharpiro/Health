class NutritionDataService
{
    private nutritionTable: Array<IFood>;
    private currentDay: ICurrentDay;

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
                this.nutritionTable = data.data;
                dfd.resolve(data);
                return null;
            }, (error) =>
                {
                    dfd.reject(error);
                });
        }
        else
        {
            var dataResponse = { data: this.nutritionTable }
            dfd.resolve(dataResponse);
        }
        return dfd.promise;
    }

    public getMostRecentDay(forceUpdate?: RequestOptions): ng.IPromise<any>
    {
        var dfd = this.$q.defer();
        if (!this.currentDay || forceUpdate === RequestOptions.Force)
        {
            this.nutritionService.getMostRecentDay().then((data) =>
            {
                this.currentDay = data.data;
                dfd.resolve(data);
                return null;
            }, (error) =>
                {
                    dfd.reject(error);
                });
        }
        else
        {
            var dataResponse = { data: this.currentDay }
            dfd.resolve(dataResponse);
        }
        return dfd.promise;
    }

    public getFoodById(foodId: number): string
    {
        var food: string;
        if (!this.nutritionTable) return;
        this.nutritionTable.forEach((value) =>
        {
            if (value.Id === foodId)
                food = value.Name;
        });
        return food;
    }
}

app.service("nutritionDataService", ["$q", "nutritionService", NutritionDataService]);

enum RequestOptions
{
    Force
}