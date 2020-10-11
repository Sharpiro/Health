import { FormControl } from "@angular/forms";
import { Observable } from 'rxjs';

export class TypedFormControl<T> extends FormControl {
  constructor(initial?: T, validators?: any) {
    super(initial, validators);
  }

  get valueTyped(): T {
    return this.value;
  }

  get valueChangesTyped(): Observable<T> {
    return this.valueChanges;
  }

  setValueTyped(val: T) {
    this.setValue(val);
  }
}
