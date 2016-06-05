class Food implements IFood
{
    public Id: number;
    public Name: string;
    public Calories: number;
    public Protein: number;
    public Fat: number;
    public Carbs: number;
    public Sugar: number;
    public ServingSize: number;
    public ServingName: string;
    public Fiber: number;
    public Sodium: number;
    public Potassium: number;

    constructor(food: IFood)
    {
        this.Id = food.Id;
        this.Name = food.Name;
        this.Calories = food.Calories
        this.Protein = food.Protein;
        this.Fat = food.Fat;
        this.Carbs = food.Carbs;
        this.Sugar = food.Sugar;
        this.ServingSize = food.ServingSize;
        this.ServingName = food.ServingName;
        this.Fiber = food.Fiber;
        this.Sodium = food.Sodium;
        this.Potassium = food.Potassium;
    }
}