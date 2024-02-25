import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../shared/ui/modal/modal.component';
import { Checklist } from '../shared/interfaces/checklist';
import { FormBuilder } from '@angular/forms';
import { FormModalComponent } from '../shared/ui/form-modal/form-modal.component';
import { ChecklistService } from '../shared/data-access/checklist.service';
import { ChecklistListComponent } from './ui/checklist-list/checklist-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <header>
      <h1>Quicklist</h1>
      <button (click)="checklistBeingEdited.set({})">Add Quicklist</button>
    </header>
    <app-checklist-list
      [checklists]="checklistService.checklists()"
    ></app-checklist-list>
    <app-modal [isOpen]="!!checklistBeingEdited()">
      <ng-template>
        <app-form-modal
          [title]="
            checklistBeingEdited()?.title
              ? checklistBeingEdited()!.title!
              : 'Add checklist'
          "
          [formGroup]="checklistForm"
          (close)="checklistBeingEdited.set(null)"
          (save)="checklistService.add$.next(checklistForm.getRawValue())"
        />
      </ng-template>
    </app-modal>
  `,
  styles: [],
  imports: [
    CommonModule,
    ModalComponent,
    FormModalComponent,
    ChecklistListComponent,
  ],
})
export default class HomeComponent {
  checklistService = inject(ChecklistService);
  checklistBeingEdited = signal<Partial<Checklist | null>>(null);
  formBuilder = inject(FormBuilder);

  checklistForm = this.formBuilder.nonNullable.group({
    title: '',
  });

  constructor() {
    effect(() => {
      const checklist = this.checklistBeingEdited();
      if (!checklist) {
        this.checklistForm.reset();
      }
    });
  }
}
