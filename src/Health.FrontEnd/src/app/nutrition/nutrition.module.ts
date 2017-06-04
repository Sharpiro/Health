import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NutritionRoutingModule } from './nutrition-routing.module';
import { FoodsComponent } from './foods/foods.component';
import { NutritionComponent } from './nutrition.component';
import { ContextMenuModule } from 'ngx-contextmenu';
import { CaloriesComponent } from './calories/calories.component';
import { NutritionService } from "app/nutrition/nutrition.service";
import { FoodDisplayPipe } from './shared/pipes/food-display.pipe';
import { ToolsComponent } from './tools/tools.component';
import { HistoryComponent } from './history/history.component';
import { ChartistModule } from "ng-chartist/src/chartist.component";

@NgModule({
  imports: [
    CommonModule,
    NutritionRoutingModule,
    FormsModule,
    ContextMenuModule,
    ChartistModule
  ],
  declarations: [FoodsComponent, NutritionComponent, CaloriesComponent, FoodDisplayPipe, ToolsComponent, HistoryComponent],
  providers: [NutritionService]
})
export class NutritionModule { }