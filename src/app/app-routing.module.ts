import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MealsComponent } from './meals/meals.component';
import { ChartsComponent } from './charts/charts.component';
import { LogComponent } from './log/log.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  { path: "", component: DashboardComponent },
  { path: "meals", component: MealsComponent },
  { path: "charts", component: ChartsComponent },
  { path: "log", component: LogComponent },
  { path: "settings", component: SettingsComponent },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
