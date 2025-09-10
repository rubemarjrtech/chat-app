export type EventTypes = {
  name: string;
  handler: (...args: any[]) => void | Promise<void>;
};
