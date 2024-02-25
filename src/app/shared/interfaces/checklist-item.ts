import { RemoveChecklist } from './checklist';

export interface ChecklistItem {
  id: string;
  title: string;
  checked: boolean;
  checklistId: string;
}

export type AddChecklistItem = {
  item: Omit<ChecklistItem, 'id' | 'checked' | 'checklistId'>;
  checklistId: RemoveChecklist;
};

export type EditChecklistItem = {
  id: ChecklistItem['id'];
  data: AddChecklistItem;
};
export type RemoveChecklistItem = ChecklistItem['id'];
export type ToggleChecklistItem = ChecklistItem['id'];
export type ResetAllChecklistItem = ChecklistItem['checklistId'];
