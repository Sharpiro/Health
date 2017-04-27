import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NutritionService } from "app/nutrition/nutrition.service";
import { ContextMenuService, ContextMenuComponent } from 'ngx-contextmenu';

@Component({
  selector: 'app-foods',
  templateUrl: './foods.component.html',
  styleUrls: ['./foods.component.css']
})
export class FoodsComponent implements OnInit {

  private data: Array<any>;

  public items = [
    { name: 'John', otherProperty: 'Foo' },
    { name: 'Joe', otherProperty: 'Bar' }
  ];

  @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;

  constructor(private nutritionService: NutritionService, private contextMenuService: ContextMenuService) { }

  async ngOnInit() {
    this.data = await this.nutritionService.getAllFoods().toPromise();
  }

  private rowClicked(food: any): void {
    food.clicked = !food.clicked;
    console.log(`clicked ${food.name}`);
  }

  private isHighlighted(food: any): boolean {
    return food.clicked;
  }

  private eventHandler(event, food: any) {
    // food.clicked = false;
    if (event.keyCode !== 13) return;
    food.clicked = false;
    console.log(`keyed ${food.name}`);
    console.log(event, event.keyCode, event.keyIdentifier);
  }
}