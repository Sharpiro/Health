import { Component, OnInit, Injectable } from '@angular/core'
import { Meal } from '../dashboard/models/meal'
import { BehaviorSubject, Observable, of } from 'rxjs';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material';

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
    this.initialize()
  }

  initialize() {
    const mealsJson = localStorage.getItem("meals")
    const meals: Meal[] = mealsJson ? JSON.parse(mealsJson).map((m: any) => new Meal(m)) : []

    const mealTree = this.buildMealTree(meals)


    const data = this.buildFileTree(mealTree, 0);

    this.dataChange.next(data);
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

  constructor(private database: FileDatabase) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel,
      this._isExpandable, this._getChildren);
    this.treeControl = new FlatTreeControl<FileFlatNode>(this._getLevel, this._isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    database.dataChange.subscribe(data => this.dataSource.data = data);
  }

  ngOnInit() {
    this.database.initialize()
  }

  transformer = (node: FileNode, level: number) => {
    return new FileFlatNode(!!node.children, node.filename, level, node.type);
  }

  private _getLevel = (node: FileFlatNode) => node.level;

  private _isExpandable = (node: FileFlatNode) => node.expandable;

  private _getChildren = (node: FileNode): Observable<FileNode[]> => of(node.children);

  hasChild = (_: number, _nodeData: FileFlatNode) => _nodeData.expandable;
}
