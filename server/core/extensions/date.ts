// declare global {
// }
interface DateConstructor {
  iso(): string;
}

Date.iso = () => new Date().toISOString();
