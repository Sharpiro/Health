import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { DashboardComponent } from './dashboard/dashboard.component'
import { MealsComponent } from './meals/meals.component'

const routes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "meals", component: MealsComponent },
  { path: '**', redirectTo: 'dashboard' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
