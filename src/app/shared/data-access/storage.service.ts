import { InjectionToken, PLATFORM_ID, inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Checklist } from '../interfaces/checklist';
import { ChecklistItem } from '../interfaces/checklist-item';

export const LOCAL_STORAGE = new InjectionToken<Storage>('Local Storage', {
  providedIn: 'root',
  factory: () =>
    inject(PLATFORM_ID) === 'browser' ? window.localStorage : ({} as Storage),
});

const CHECKLISTS = 'checklists';
const CHECKLIST_ITEMS = 'checklistItems';

@Injectable({ providedIn: 'root' })
export class StorageService {
  storage = inject(LOCAL_STORAGE);

  loadChecklists() {
    const checklists = this.storage.getItem(CHECKLISTS);
    return of(checklists ? (JSON.parse(checklists) as Checklist[]) : []);
  }

  loadChecklistItems() {
    const checklistItems = this.storage.getItem(CHECKLIST_ITEMS);
    return of(
      checklistItems ? (JSON.parse(checklistItems) as ChecklistItem[]) : []
    );
  }

  saveChecklists(checklists: Checklist[]) {
    this.storage.setItem(CHECKLISTS, JSON.stringify(checklists));
  }

  saveChecklistItems(checklistItems: ChecklistItem[]) {
    this.storage.setItem(CHECKLIST_ITEMS, JSON.stringify(checklistItems));
  }
}
