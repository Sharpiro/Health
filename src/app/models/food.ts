export interface Food {
  name: string
  shortName: string
  calories: number
  servingSize: number
  servingSizeType: "Grams" | "Item" | "Ounces"
  carbs: number
  fat: number
  fiber: number
  potassium: number
  protein: number
  sodium: number
  sugar: number
  active: boolean
}

export class FoodX {
  constructor(
    readonly name: string,
    readonly shortName: string,
    readonly calories: number,
    readonly servingSize: number,
    readonly servingSizeType: "Grams" | "Item" | "Ounces",
    readonly carbs: number,
    readonly fat: number,
    readonly fiber: number,
    readonly potassium: number,
    readonly protein: number,
    readonly sodium: number,
    readonly sugar: number,
    readonly active: boolean
  ) { }
}
