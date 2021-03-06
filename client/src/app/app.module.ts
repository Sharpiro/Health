import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTreeModule } from '@angular/material/tree';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { CustomSelectComponent } from './custom-select/custom-select.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmationComponentComponent } from './confirmation-component/confirmation-component.component';
import { MoreOptionsComponent } from './more-options/more-options.component';
import { MealsComponent } from './meals/meals.component';
import { TreeViewComponent } from './meals/tree-view/tree-view.component';
import { FileDatabase } from './meals/tree-view/file-controls';
import { ChartsComponent } from './charts/charts.component';
import { CalorieChartComponent } from './charts/calorie-chart/calorie-chart.component';
import { MacrosChartComponent } from './charts/macros-chart/macros-chart.component';
import { WaterChartComponent } from './charts/water-chart/water-chart.component';
import { LogComponent } from './log/log.component';
import { SettingsComponent } from './settings/settings.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CustomSelectComponent,
    ConfirmationComponentComponent,
    MoreOptionsComponent,
    MealsComponent,
    TreeViewComponent,
    ChartsComponent,
    CalorieChartComponent,
    MacrosChartComponent,
    WaterChartComponent,
    LogComponent,
    SettingsComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatSelectModule,
    MatDividerModule,
    MatListModule,
    MatTableModule,
    MatTabsModule,
    MatTreeModule,
    MatToolbarModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    MatCheckboxModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    FileDatabase
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    CustomSelectComponent,
    ConfirmationComponentComponent,
    MoreOptionsComponent
  ]
})
export class AppModule { }
