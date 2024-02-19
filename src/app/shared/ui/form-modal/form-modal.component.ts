import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule, KeyValuePipe],
  template: `
    <header>{{ title }}</header>
    <section>
      <form [formGroup]="formGroup" (ngSubmit)="save.emit(); close.emit()">
        @for (control of formGroup.controls | keyvalue; track control.key) {
        <div>
          <label [for]="control.key">{{ control.key }}</label>
          <input
            [formControlName]="control.key"
            [id]="control.key"
            type="text"
          />
        </div>
        }
        <button type="submit">Save</button>
      </form>
    </section>
  `,
  styles: [],
})
export class FormModalComponent {
  @Input({ required: true }) formGroup!: FormGroup;
  @Input({ required: true }) title!: string;
  @Output() save = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
}
