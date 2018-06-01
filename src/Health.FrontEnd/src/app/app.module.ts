import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NutritionModule } from "app/nutrition/nutrition.module";
import { ToastrNotificationService } from "app/shared/toastr-notification.service";
import { INotificationService } from "app/shared/i-notification-service";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    NutritionModule
  ],
  providers: [
  { provide: 'INotificationService', useClass: ToastrNotificationService}
],
  bootstrap: [AppComponent]
})
export class AppModule { }
