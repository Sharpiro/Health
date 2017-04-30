import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NutritionService } from "app/nutrition/nutrition.service";
import { ContextMenuService, ContextMenuComponent } from 'ngx-contextmenu';
import { IFood } from "app/nutrition/shared/ifood";
import { KeyCode } from "app/nutrition/shared/keycode";

@Component({
  selector: 'app-foods',
  templateUrl: './foods.component.html',
  styleUrls: ['./foods.component.css']
})
export class FoodsComponent implements OnInit {

  private data: Array<any>;

  @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;

  constructor(private nutritionService: NutritionService, private contextMenuService: ContextMenuService) { }

  async ngOnInit() {
    this.data = await this.nutritionService.getAllFoods().toPromise();
  }

  private async checkBoxChangeHandler(food: IFood, propertyName: string) {
    var x: boolean = food[propertyName];
    food[propertyName] = !food[propertyName]
    await this.nutritionService.updateFood(food);
    console.log(`updated ${food.id}: ${food.name} as active: ${food.isActive} in database`);
  }

  private async eventHandler(event: KeyboardEvent, food: IFood, propertyName: string, element: HTMLInputElement) {
    // console.log(event, event.keyCode);
    if (!food.clicked) return;
    if (event.keyCode === KeyCode.Esc) resetElement();
    if (event.keyCode !== KeyCode.Enter && event.keyCode !== KeyCode.Tab) return;
    var oldValue = food[propertyName].toString();
    let newValue = element.value;
    if (event.keyCode === 13) {
      food.clicked = false;
    }
    if (newValue === oldValue)
      return;
    if (newValue === '') {
      resetElement();
      return;
    }
    console.log(`old ${propertyName} ${oldValue}`);
    console.log(`new ${propertyName} ${newValue}`);
    food[propertyName] = newValue;
    await this.nutritionService.updateFood(food);
    console.log(`updated ${food.id}: ${food.name} in database`);

    function resetElement() {
      console.log("resetting..");
      element.value = food[propertyName];
      food.clicked = false;
    }
  }
}