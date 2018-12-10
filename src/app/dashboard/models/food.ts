export interface Food {
  id: number
  name: string
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
