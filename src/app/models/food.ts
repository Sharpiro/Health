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
