import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FoodsComponent } from "app/nutrition/foods/foods.component";
import { NutritionComponent } from "app/nutrition/nutrition.component";
import { CaloriesComponent } from "app/nutrition/calories/calories.component";

const routes: Routes = [
  {
    path: "nutrition", component: NutritionComponent, children: [
      { path: '', pathMatch: 'full', redirectTo: 'calories' },
      { path: "foods", component: FoodsComponent },
      { path: "calories", component: CaloriesComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NutritionRoutingModule { }