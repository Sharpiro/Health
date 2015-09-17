class Meal implements IMeal
{
    public date: Date;
    public mealNumber: number;
    public mealEntries: Array<IMealEntry> = []; 
}