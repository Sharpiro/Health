import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NutritionRoutingModule } from './nutrition-routing.module';
import { FoodsComponent } from './foods/foods.component';
import { NutritionComponent } from './nutrition.component';
import { ContextMenuModule } from 'ngx-contextmenu';
import { CaloriesComponent } from './calories/calories.component';
import { NutritionService } from "app/nutrition/nutrition.service";

@NgModule({
  imports: [
    CommonModule,
    NutritionRoutingModule,
    FormsModule,
    ContextMenuModule
  ],
  declarations: [FoodsComponent, NutritionComponent, CaloriesComponent],
  providers: [NutritionService]
})
export class NutritionModule { }