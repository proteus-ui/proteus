export interface UseControllableStateOptions<T> {
  value?: T;
  defaultValue: T;
  onChange?: (next: T) => void;
}

export type UseControllableStateReturn<T> = [T, (next: T) => void];
