class DestinyFilter
{
    public static FoodIdFilter(nutritionDataService: NutritionDataService)
    {
        return (food: any) =>
        {
            let output: string;
            if (food)
            {
                const foodName = nutritionDataService.getFoodById(food.FoodId);
                output = `${foodName}: ${food.Calories}`;
            }
            return output;
        };
    }
}

app.filter("foodIdFilter", (nutritionDataService: NutritionDataService) => DestinyFilter.FoodIdFilter(nutritionDataService));