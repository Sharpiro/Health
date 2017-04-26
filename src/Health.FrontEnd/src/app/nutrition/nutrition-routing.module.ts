import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FoodsComponent } from "app/nutrition/foods/foods.component";
import { NutritionComponent } from "app/nutrition/nutrition.component";

const routes: Routes = [
  {
    path: "nutrition", component: NutritionComponent, children: [
      { path: '', pathMatch: 'full', redirectTo: 'foods' },
      { path: "foods", component: FoodsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NutritionRoutingModule { }