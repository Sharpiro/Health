import { DayOverview } from "app/nutrition/shared/dtos/day-overview";

export interface NutritionHistory {
    days: DayOverview[];
    average: number;
    min: number;
    max: number;
}