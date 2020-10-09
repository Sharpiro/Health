import { Component } from '@angular/core';
import { settings } from './settings';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  settings = settings;

  updateStorage() {
    localStorage.setItem("settings", JSON.stringify(this.settings));
  }
}
