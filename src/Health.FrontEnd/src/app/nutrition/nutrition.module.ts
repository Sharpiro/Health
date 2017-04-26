import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NutritionRoutingModule } from './nutrition-routing.module';
import { FoodsComponent } from './foods/foods.component';
import { NutritionComponent } from './nutrition.component';

@NgModule({
  imports: [
    CommonModule,
    NutritionRoutingModule
  ],
  declarations: [FoodsComponent, NutritionComponent]
})
export class NutritionModule { }
