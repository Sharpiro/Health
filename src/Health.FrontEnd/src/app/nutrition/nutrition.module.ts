import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NutritionRoutingModule } from './nutrition-routing.module';
import { FoodsComponent } from './foods/foods.component';
import { NutritionComponent } from './nutrition.component';
import { ContextMenuModule } from 'angular2-contextmenu';

@NgModule({
  imports: [
    CommonModule,
    NutritionRoutingModule,
    FormsModule,
    ContextMenuModule
  ],
  declarations: [FoodsComponent, NutritionComponent]
})
export class NutritionModule { }