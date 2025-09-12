export interface ICacheClient {
  init(): Promise<void> | void;
}
