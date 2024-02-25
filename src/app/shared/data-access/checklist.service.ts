import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { AddChecklist, Checklist } from '../interfaces/checklist';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, take } from 'rxjs';
import { StorageService } from './storage.service';

export interface ChecklistState {
  checklists: Checklist[];
  loaded: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ChecklistService {
  #storage = inject(StorageService);

  // state
  #state = signal<ChecklistState>({
    checklists: [],
    loaded: false,
    error: null,
  });

  // selectors
  checklists = computed(() => this.#state().checklists);
  loaded = computed(() => this.#state().loaded);

  // sources
  add$ = new Subject<AddChecklist>();
  checklistsLoaded$ = this.#storage.loadChecklists();

  constructor() {
    // reducers
    this.add$.pipe(takeUntilDestroyed()).subscribe((checklist) =>
      this.#state.update((state) => ({
        ...state,
        checklists: [...this.checklists(), this.addIdToChecklist(checklist)],
      }))
    );

    this.checklistsLoaded$.pipe(takeUntilDestroyed()).subscribe({
      next: (checklists) =>
        this.#state.update((state) => ({
          ...state,
          checklists,
          loaded: true,
        })),
      error: (error) => this.#state.update((state) => ({ ...state, error })),
    });

    effect(() => {
      if (this.loaded()) {
        this.#storage.saveChecklists(this.checklists());
      }
    });
  }

  private addIdToChecklist(checklist: AddChecklist): Checklist {
    return {
      ...checklist,
      id: this.generateSlug(checklist.title),
    };
  }

  private generateSlug(title: string): string {
    let slug = title.toLowerCase().replace(/\s+/g, '-');

    const matchingSlug = this.checklists().find(
      (checklist) => checklist.id === slug
    );

    if (matchingSlug) {
      slug = slug + Date.now().toString();
    }

    return slug;
  }
}
