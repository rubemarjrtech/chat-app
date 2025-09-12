export interface IDatabaseClient {
  init(): Promise<void>;
  stop?(): Promise<void>;
}
