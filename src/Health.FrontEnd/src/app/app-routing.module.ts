import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NutritionComponent } from "app/nutrition/nutrition.component";

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'nutrition' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
