export enum ActivityLevel {
    BasalMetabolicRate,
    Sedentary,
    LightlyActive,
    ModeratelyActive,
    VeryActive,
    ExtraActive
}

export const ActivityLevels = [
    { level: ActivityLevel.BasalMetabolicRate, name: "BMR" },
    { level: ActivityLevel.Sedentary, name: "Sedentary" },
    { level: ActivityLevel.LightlyActive, name: "LightlyActive" },
    { level: ActivityLevel.ModeratelyActive, name: "ModeratelyActive" },
    { level: ActivityLevel.VeryActive, name: "VeryActive" },
    { level: ActivityLevel.ExtraActive, name: "ExtraActive" }
];