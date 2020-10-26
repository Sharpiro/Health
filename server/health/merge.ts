import { getMapWithDupes } from "../core/map.ts";

export function validateHealthRoot(json: any): asserts json is HealthStore {
  if (!json) {
    throw new Error("json was null");
  }
  if (!json.days) {
    throw new Error("days not present");
  }
  if (!json.logs) {
    throw new Error("logs not present");
  }
  return json;
}

export function mergeDays(
  healthStore: HealthStore,
  postedDays: Day[],
): Result<number, SimpleRes> {
  const { map: newDataMap, dupes } = getMapWithDupes(
    postedDays,
    "timestamp",
  );
  if (dupes.length) {
    return { error: { status: 400, body: "posted data contained duplicates" } };
  }

  const { map: persistentMap, dupes: persistentDupes } = getMapWithDupes(
    healthStore.days,
    "timestamp",
  );
  if (persistentDupes.length) {
    return { error: { status: 400, body: "stored data contained duplicates" } };
  }

  const newItems = [...getNewItem(persistentMap, newDataMap)];
  if (!newItems.length) {
    return { ok: 0 };
  }

  addDaysToHealthStore(healthStore, persistentMap, newItems);

  return { ok: newItems.length };
}

export function mergeLogs(
  healthStore: HealthStore,
  postedLogs: Log[],
): Result<number, SimpleRes> {
  const { map: newDataMap, dupes } = getMapWithDupes(
    postedLogs,
    "date",
  );
  if (dupes.length) {
    return { error: { status: 400, body: "posted data contained duplicates" } };
  }

  const { map: persistentMap, dupes: persistentDupes } = getMapWithDupes(
    healthStore.logs,
    "date",
  );
  if (persistentDupes.length) {
    return { error: { status: 400, body: "stored data contained duplicates" } };
  }

  const newItems = [...getNewItem(persistentMap, newDataMap)];
  if (!newItems.length) {
    return { ok: 0 };
  }

  addLogsToHealthStore(healthStore, persistentMap, newItems);

  return { ok: newItems.length };
}

export function* getNewItem<T>(
  datastore: Map<string, T>,
  newData: Map<string, T>,
) {
  for (const [key, day] of newData) {
    if (!datastore.has(key)) {
      yield day;
    }
  }
}

export function addDaysToHealthStore(
  healthRoot: HealthStore,
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

export function addLogsToHealthStore(
  healthRoot: HealthStore,
  datastore: Map<string, Log>,
  days: Iterable<Log>,
) {
  for (const day of days) {
    datastore.set(day.date, day);
  }
  healthRoot.logs = [...datastore.values()].sort((a, b) =>
    a.date < b.date ? -1 : 1
  );
}

export interface Day {
  timestamp: string;
  meals: any[];
}

export interface Log {
  date: string;
  message: string;
}

export interface HealthStore {
  days: Day[];
  logs: Log[];
}

type SimpleRes = { status: number; body: string };
type Result<T, U> = { ok: T } | { error: U };
