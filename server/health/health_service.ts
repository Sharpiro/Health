import { HealthStore, validateHealthRoot } from "./merge.ts";
import "../core/extensions/date.ts";

export class HealthService {
  private syncPath;

  constructor(
    private storageDir: string,
    private syncFileName = "health_data.json",
  ) {
    this.syncPath = `${storageDir}/${syncFileName}`;
  }

  async saveHealthStore(healthStore: HealthStore) {
    const backupPath = `${this.storageDir}/${Date.iso()}_${this.syncFileName}`;
    await Deno.copyFile(this.syncPath, backupPath);
    await Deno.writeTextFile(
      this.syncPath,
      JSON.stringify(healthStore),
    );
  }

  async loadHealthStore() {
    const storedText = await Deno.readTextFile(this.syncPath);
    const healthStore = JSON.parse(storedText);
    validateHealthRoot(healthStore);
    return healthStore;
  }
}
