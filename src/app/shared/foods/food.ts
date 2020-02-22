import { IsInt, IsString, IsBoolean, IsNumber } from "class-validator"

export class Food {
  @IsString()
  readonly name!: string
  @IsString()
  readonly shortName!: string
  @IsInt()
  readonly calories!: number
  @IsInt()
  readonly servingSize!: number
  @IsString()
  readonly servingSizeType!: "Grams" | "Item" | "Ounces"
  @IsInt()
  readonly carbs!: number
  @IsNumber()
  readonly fat!: number
  @IsInt()
  readonly fiber!: number
  @IsInt()
  readonly potassium!: number
  @IsInt()
  readonly protein!: number
  @IsInt()
  readonly sodium!: number
  @IsInt()
  readonly sugar!: number
  @IsBoolean()
  readonly active!: boolean

  constructor(init: Food) {
    Object.assign(this, init)
  }
}
