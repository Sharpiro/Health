export class CaseMap<V> extends Map<string, V> {
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

/** Return a map as well as any dupes found */
export function getMapWithDupes<T, K extends LookupKeys<T>>(
  datastore: T[],
  key: K,
) {
  const map = new Map<T[K], T>();
  const dupes = [];
  for (const item of datastore) {
    if (map.has(item[key])) {
      dupes.push(item);
    } else {
      map.set(item[key], item);
    }
  }
  return { map, dupes };
}

type LookupKeys<T> = {
  [P in keyof T]: T[P] extends string | number ? P : never;
}[keyof T];
