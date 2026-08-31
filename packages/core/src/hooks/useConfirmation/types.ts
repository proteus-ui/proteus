export interface UseConfirmationReturn {
  open: boolean;
  ask: () => Promise<boolean>;
  confirm: () => void;
  cancel: () => void;
}
