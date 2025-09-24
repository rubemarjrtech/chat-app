export interface IDefaultSocketServer<T> {
  _socketServer: T;
  setInstance(): IDefaultSocketServer<T> | void;
  getInstance(): T;
}
