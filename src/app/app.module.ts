import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { DashboardComponent } from './dashboard/dashboard.component'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { ReactiveFormsModule } from '@angular/forms'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatSelectModule } from '@angular/material/select'
import { MatDividerModule } from '@angular/material/divider'
import { MatListModule } from '@angular/material/list'
import { MatTableModule } from '@angular/material/table'
import { MatTabsModule } from '@angular/material/tabs'
import { MatTreeModule } from '@angular/material/tree'
import { MatToolbarModule } from '@angular/material/toolbar'
import { ServiceWorkerModule } from '@angular/service-worker'
import { environment } from '../environments/environment'
import { CustomSelectComponent } from './custom-select/custom-select.component'
import { MatDialogModule } from '@angular/material'

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CustomSelectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatSelectModule,
    MatDividerModule,
    MatListModule,
    MatTableModule,
    MatTabsModule,
    MatTreeModule,
    MatToolbarModule,
    MatDialogModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [CustomSelectComponent]
})
export class AppModule { }
