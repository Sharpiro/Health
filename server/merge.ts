export function* getNewDays(
  datastore: Map<string, Day>,
  newData: Map<string, Day>,
) {
  for (const [key, day] of newData) {
    if (!datastore.has(key)) {
      yield day;
    }
  }
}

export function addDaysToDatastore(
  healthRoot: HealthRoot,
  datastore: Map<string, Day>,
  days: Iterable<Day>,
) {
  for (const day of days) {
    datastore.set(day.timestamp, day);
  }
  healthRoot.days = [...datastore.values()].sort((a, b) =>
    a.timestamp < b.timestamp ? -1 : 1
  );
}

export interface Day {
  timestamp: string;
  meals: any[];
}

export interface HealthRoot {
  days: Day[];
  logs: any[];
}
