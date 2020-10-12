import { getMapWithDupes } from "./map.ts";
import {
  assert,
} from "https://deno.land/std@0.74.0/testing/asserts.ts";

Deno.test("get map with dupes", () => {
  const newData = {
    days: [
      {
        timestamp: "2020-10-12T14:31:31.061Z",
      },
      {
        timestamp: "2020-10-11T14:31:31.061Z",
      },
      {
        timestamp: "2020-10-13T14:31:31.061Z",
      },
      {
        timestamp: "2020-10-11T14:31:31.061Z",
      },
    ],
  };

  let { map, dupes } = getMapWithDupes(newData.days, "timestamp");
  assert(map.size === 3);
  assert(dupes.length === 1);
});

Deno.test("get map with no dupes test", () => {
  const newData = {
    days: [
      {
        timestamp: "2020-10-12T14:31:31.061Z",
      },
      {
        timestamp: "2020-10-11T14:31:31.061Z",
      },
      {
        timestamp: "2020-10-13T14:31:31.061Z",
      },
    ],
  };

  let { map, dupes } = getMapWithDupes(newData.days, "timestamp");
  assert(map.size === 3);
  assert(dupes.length === 0);
});
