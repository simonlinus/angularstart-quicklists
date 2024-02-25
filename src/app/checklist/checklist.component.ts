import { Component, computed, effect, inject, signal } from '@angular/core';
import { ChecklistService } from '../shared/data-access/checklist.service';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChecklistHeaderComponent } from './ui/checklist-header/checklist-header.component';
import { FormBuilder } from '@angular/forms';
import { ChecklistItem } from '../shared/interfaces/checklist-item';
import { ModalComponent } from '../shared/ui/modal/modal.component';
import { FormModalComponent } from '../shared/ui/form-modal/form-modal.component';
import { ChecklistItemService } from './data-access/checklist-item.service';
import { ChecklistItemListComponent } from './ui/checklist-item-list/checklist-item-list.component';

@Component({
  selector: 'app-checklist',
  standalone: true,
  imports: [
    ChecklistHeaderComponent,
    ModalComponent,
    FormModalComponent,
    ChecklistItemListComponent,
  ],
  template: `
    @if (checklist(); as checklist) {
    <app-checklist-header
      [checklist]="checklist"
      (addItem)="checklistItemBeingEdited.set({})"
      (resetChecklist)="checklistItemService.resetAll$.next(checklist.id)"
    />

    } @if (!!checklistItemBeingEdited()) {
    <app-form-modal
      title="Create item"
      [formGroup]="checklistItemForm"
      (save)="
        checklistItemService.add$.next({
          item: checklistItemForm.getRawValue(),
          checklistId: checklist()?.id!
        })
      "
      (close)="checklistItemBeingEdited.set(null)"
    />
    }

    <app-checklist-item-list
      [checklistItems]="items()"
      (toggle)="checklistItemService.toggle$.next($event)"
    />
  `,
  styles: ``,
})
export default class ChecklistComponent {
  checklistService = inject(ChecklistService);
  checklistItemService = inject(ChecklistItemService);
  #route = inject(ActivatedRoute);
  #params = toSignal(this.#route.paramMap);
  #formBuilder = inject(FormBuilder);

  checklistItemBeingEdited = signal<Partial<ChecklistItem | null>>(null);

  checklist = computed(() =>
    this.checklistService
      .checklists()
      .find((c) => c.id === this.#params()?.get('id'))
  );

  checklistItemForm = this.#formBuilder.nonNullable.group({
    title: '',
  });

  items = computed(() =>
    this.checklistItemService
      .checklistItems()
      .filter((item) => item.checklistId === this.#params()?.get('id'))
  );

  constructor() {
    effect(() => {
      const checklistItem = this.checklistItemBeingEdited();

      if (!checklistItem) {
        this.checklistItemForm.reset();
      }
    });
  }
}
