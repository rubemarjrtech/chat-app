export interface IDefaultSocketServer<T> {
  setInstance(): IDefaultSocketServer<T> | void;
  getInstance(): T;
}
