import { Component, OnInit, Injectable } from '@angular/core'
import { Meal } from '../dashboard/models/meal'
import { BehaviorSubject, Observable, of } from 'rxjs';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource, MatDialog } from '@angular/material';
import { ConfirmationComponentComponent } from '../confirmation-component/confirmation-component.component';
import { Day } from '../dashboard/models/day';

export class FileNode {
  children: FileNode[]
  filename: string
  type: any
}

export class FileFlatNode {
  constructor(
    public expandable: boolean, public filename: string, public level: number, public type: any) { }
}

@Injectable()
export class FileDatabase {
  dataChange = new BehaviorSubject<FileNode[]>([]);

  get data(): FileNode[] { return this.dataChange.value; }

  constructor() {
    // this.initialize({})
  }

  update(treeData: any) {
    const fileNodes = this.buildFileTree(treeData, 0);
    this.dataChange.next(fileNodes);
  }

  buildFileTree(obj: { [key: string]: any }, level: number): FileNode[] {
    return Object.keys(obj).reduce<FileNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new FileNode();
      node.filename = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.type = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }
}

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.css']
})
export class MealsComponent implements OnInit {
  treeControl: FlatTreeControl<FileFlatNode>;
  treeFlattener: MatTreeFlattener<FileNode, FileFlatNode>;
  dataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;
  days: Day[]

  constructor(private mealsDatabase: FileDatabase, private dialog: MatDialog) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel,
      this._isExpandable, this._getChildren);
    this.treeControl = new FlatTreeControl<FileFlatNode>(this._getLevel, this._isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    mealsDatabase.dataChange.subscribe(data => this.dataSource.data = data);
  }

  ngOnInit() {
    // initialize days database
    const daysJson = localStorage.getItem("days")
    this.days = daysJson ? JSON.parse(daysJson) : []



    // initialize meals database
    const mealsJson = localStorage.getItem("meals")
    const meals = mealsJson ? JSON.parse(mealsJson) : []
    const mealTree = this.buildMealTree(meals)
    this.mealsDatabase.update(mealTree)
  }


  buildMealTree(meals: Meal[]): any {
    const mealTree: any = {}
    for (let i = 0; i < meals.length; i++) {
      const meal = meals[i]
      const mealKey = `Meal ${i + 1}: ${meal.calories}`
      mealTree[mealKey] = {}
      for (let j = 0; j < meal.mealEntries.length; j++) {
        const mealEntry = meal.mealEntries[j]
        mealTree[mealKey][`Entry ${j + 1}: ${mealEntry.foodName}`] = mealEntry.calories
      }
    }
    return mealTree
  }

  onSaveDay() {
    let dayTimestamp = localStorage.getItem("dayTimestamp")
    if (!dayTimestamp) {
      dayTimestamp = new Date().toISOString()
    }
    const mealsJson = localStorage.getItem("meals")
    const currentMeals: Meal[] = mealsJson ? JSON.parse(mealsJson) : []
    this.days.push(new Day(dayTimestamp, currentMeals))
    this.mealsDatabase.update({})
    localStorage.setItem("days", JSON.stringify(this.days))
    localStorage.setItem("meals", "[]")
    localStorage.removeItem("dayTimestamp")
  }

  onClearLastDay() {
    const dialogRef = this.dialog.open(ConfirmationComponentComponent, {
      width: '350px',
      data: "Are you sure you want to clear the latest day?"
    })

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (!result) return

      this.days.splice(this.days.length - 1)
      localStorage.setItem("days", JSON.stringify(this.days))
    })
  }

  transformer = (node: FileNode, level: number) => {
    return new FileFlatNode(!!node.children, node.filename, level, node.type);
  }

  private _getLevel = (node: FileFlatNode) => node.level;

  private _isExpandable = (node: FileFlatNode) => node.expandable;

  private _getChildren = (node: FileNode): Observable<FileNode[]> => of(node.children);

  hasChild = (_: number, _nodeData: FileFlatNode) => _nodeData.expandable;
}
