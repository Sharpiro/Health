export class CaseMap<V> extends Map<string, V>{

  constructor(private caseSensitive: boolean) {
    super();
  }

  get(key: string) {
    const caseKey = this.caseSensitive ? key : key.toLowerCase();
    return super.get(caseKey);
  }

  set(key: string, value: V) {
    const caseKey = this.caseSensitive ? key : key.toLowerCase();
    super.set(caseKey, value);
    return this;
  }
}
