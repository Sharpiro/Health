import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NutritionModule } from "app/nutrition/nutrition.module";
import { ToastrErrorService } from "app/shared/toastr-error.service";

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
  providers: [ToastrErrorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
