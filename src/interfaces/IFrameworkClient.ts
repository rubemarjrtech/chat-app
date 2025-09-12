export interface IFrameworkClient<T> {
  instance: T;
  getInstance(): T;
  configure(): void;
}
