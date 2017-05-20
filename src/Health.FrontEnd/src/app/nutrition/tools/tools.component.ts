import { Component, OnInit } from '@angular/core';
import { NutritionService } from "app/nutrition/nutrition.service";
import { Gender, Genders } from "app/shared/enums/gender.enum";
import { ActivityLevel, ActivityLevels } from "app/shared/enums/activity-level.enum";

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.css']
})
export class ToolsComponent implements OnInit {
  public activityLevels = ActivityLevels;
  public genders = Genders;
  public user = { age: 27, gender: Gender.Male, height: 73, weight: 208.1, activityLevel: this.activityLevels[3] };
  public maintenance = 0;

  constructor(private nutritionService: NutritionService) { }

  ngOnInit() {
    this.maintenance = this.nutritionService.getMaintenanceCalories(this.user.age, this.user.gender, this.user.height, this.user.weight, this.user.activityLevel.level);
  }

  public submit(): void {
    this.maintenance = this.nutritionService.getMaintenanceCalories(this.user.age, this.user.gender, this.user.height, this.user.weight, this.user.activityLevel.level);
  }
}