import { IsInt, IsString, IsBoolean, IsNumber } from "class-validator";
import { ExcludeMethods } from 'src/lib/types';

type FoodInit = Omit<ExcludeMethods<Food>, "">;

export class Food {
  @IsString()
  name!: string;
  @IsString()
  readonly shortName!: string;
  @IsInt()
  readonly calories!: number;
  @IsInt()
  readonly servingSize!: number;
  @IsString()
  readonly servingSizeType!: "Grams" | "Item" | "Ounces";
  @IsInt()
  readonly carbs!: number;
  @IsNumber()
  readonly fat!: number;
  @IsInt()
  readonly fiber!: number;
  @IsInt()
  readonly potassium!: number;
  @IsInt()
  readonly protein!: number;
  @IsInt()
  readonly sodium!: number;
  @IsInt()
  readonly sugar!: number;
  @IsBoolean()
  readonly active!: boolean;

  constructor(init: FoodInit) {
    Object.assign(this, init);
  }
}

export type FoodInfo = { name: string, servingSize: number, calories: number; };

export interface GroupedFood {
  name: string;
  shortName: string;
  foods: FoodInfo[];
}

// let json: unknown;
// validateExportJson(json);
// json.derp;
// json.temp;

function validateExportJson(json: unknown): asserts json is Temp {
  AssertObject(json);
  hasNumberProperty(json, "derp");
  hasStringProperty(json, "temp");
  hasArrayProperty(json, "arr");
  changePropertyType<typeof json, "arr", number[]>(json, "arr");
  // type TempType = Omit<typeof json, "arr">;
  // type TempType2 = TempType & Record<"arr", number[]>;
  // type TempType2 = typeof json & Record<"arr", number[]>;
  // type TempType2 = Omit<typeof json, "arr"> & Record<"arr", number[]>;

  // let temp: TempType2 = {} as TempType2;
  // let xxx = json as TempType2;
  // changePropertyType<typeof json, "arr", number[]>(json, "arr");
  // temp.
  var x = json.arr[0];
  AssertType<Temp>(json);
  // AssertType<Temp>(temp);
}


function AssertObject(obj: unknown): asserts obj is object {
  if (typeof obj !== "object" || !obj) throw new Error();
}

function AssertType<X>(obj: X): asserts obj is X { }

function hasNumberProperty<X extends {}, Y extends string>(obj: X, prop: Y): asserts obj is X & Record<Y, number> {
  if (typeof (obj as any)[prop] === "number") throw new Error();
}

function hasStringProperty<X extends {}, Y extends string>(obj: X, prop: Y): asserts obj is X & Record<Y, string> {
  if (typeof (obj as any)[prop] === "string") throw new Error();
}

function hasArrayProperty<X extends {}, Y extends string>(obj: X, prop: Y): asserts obj is X & Record<Y, unknown[]> {
  if (Array.isArray((obj as any)[prop])) throw new Error();
}

function changePropertyType<X extends {}, Y extends string, Z>(obj: X, prop: Y): asserts obj is X & Record<Y, Z> {
  // Type 
}


interface Temp {
  derp: number;
  temp: string;
  arr: number[];
}