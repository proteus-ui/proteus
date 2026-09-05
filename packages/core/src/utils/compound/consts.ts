export const COMPOUND_ERROR = {
  InvalidChild: (parentName: string, slotNames: string, index: number) =>
    `${parentName} direct children must be slot elements (${slotNames}). Invalid at index ${index}.`,
  DuplicateSlot: (parentName: string, slotName: string) =>
    `Duplicate ${parentName}.${slotName}. Each slot may appear at most once.`,
} as const;
