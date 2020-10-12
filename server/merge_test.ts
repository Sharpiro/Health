import {
  assert,
} from "https://deno.land/std@0.74.0/testing/asserts.ts";
import { getMapWithDupes } from "./core/map.ts";
import { getNewDays } from "./merge.ts";

Deno.test("Test Merge", () => {
  const persistentData = {
    days: [
      {
        timestamp: "2020-10-11T14:31:31.061Z",
        meals: [],
      },
      {
        timestamp: "2020-10-12T14:31:31.061Z",
        meals: [],
      },
    ],
  };
  const newData = {
    days: [
      {
        timestamp: "2020-10-11T14:31:31.061Z",
        meals: [],
      },
      {
        timestamp: "2020-10-12T14:31:31.061Z",
        meals: [],
      },
      {
        timestamp: "2020-10-13T14:31:31.061Z",
        meals: [],
      },
    ],
  };

  const { map: persistentMap } = getMapWithDupes(
    persistentData.days,
    "timestamp",
  );
  const { map: newDataMap } = getMapWithDupes(
    newData.days,
    "timestamp",
  );
  const newDays = [...getNewDays(persistentMap, newDataMap)];

  assert(newDays.length === 1);
  assert(persistentMap.size === 3);
});
