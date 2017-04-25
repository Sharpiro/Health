import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NutritionRoutingModule } from './nutrition-routing.module';
import { FoodsComponent } from './foods/foods.component';
import { NutritionComponent } from './nutrition.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
  imports: [
    CommonModule,
    NutritionRoutingModule,
    Ng2SmartTableModule
  ],
  declarations: [FoodsComponent, NutritionComponent]
})
export class NutritionModule { }
