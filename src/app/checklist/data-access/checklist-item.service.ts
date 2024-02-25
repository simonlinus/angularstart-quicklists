import {
  DestroyRef,
  Injectable,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Subject, map, take, tap } from 'rxjs';
import { StorageService } from 'src/app/shared/data-access/storage.service';
import {
  AddChecklistItem,
  ChecklistItem,
  ResetAllChecklistItem,
  ToggleChecklistItem,
} from 'src/app/shared/interfaces/checklist-item';

export interface ChecklistItemsState {
  checklistItems: ChecklistItem[];
  loaded: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ChecklistItemService {
  #localStorage = inject(StorageService);
  #destroyRef = inject(DestroyRef);

  // state
  #state = signal<ChecklistItemsState>({
    checklistItems: [],
    error: null,
    loaded: false,
  });

  // selectors
  checklistItems = computed(() => this.#state().checklistItems);
  loaded = computed(() => this.#state().loaded);

  // sources
  add$ = new Subject<AddChecklistItem>();
  toggle$ = new Subject<ToggleChecklistItem>();
  resetAll$ = new Subject<ResetAllChecklistItem>();
  checklistItemsLoaded$ = this.#localStorage.loadChecklistItems();

  constructor() {
    // reducers
    this.add$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((checklistItem) => {
        this.#state.update((state) => ({
          ...state,
          checklistItems: [
            ...state.checklistItems,
            {
              ...checklistItem.item,
              id: Date.now().toString(),
              checklistId: checklistItem.checklistId,
              checked: false,
            },
          ],
        }));

        this.toggle$
          .pipe(takeUntilDestroyed(this.#destroyRef))
          .subscribe((id) => {
            this.#state.update((state) => ({
              ...state,
              checklistItems: state.checklistItems.map((item) =>
                item.id === id ? { ...item, checked: !item.checked } : item
              ),
            }));
          });

        this.resetAll$
          .pipe(takeUntilDestroyed(this.#destroyRef))
          .subscribe((checklistId) => {
            this.#state.update((state) => ({
              ...state,
              checklistItems: state.checklistItems.map((item) =>
                item.checklistId === checklistId
                  ? { ...item, checked: false }
                  : item
              ),
            }));
          });

        this.checklistItemsLoaded$
          .pipe(/*takeUntilDestroyed(this.#destroyRef)*/)
          .subscribe({
            next: (checklistItems) =>
              this.#state.update((state) => ({
                ...state,
                checklistItems,
                loaded: true,
              })),
            error: (error) =>
              this.#state.update((state) => ({ ...state, error })),
          });
      });

    effect(() => {
      if (this.loaded()) {
        this.#localStorage.saveChecklistItems(this.checklistItems());
      }
    });
  }
}
