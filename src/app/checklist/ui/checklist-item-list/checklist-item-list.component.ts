import { Component, EventEmitter, Input, Output, input } from '@angular/core';
import { ChecklistItem } from 'src/app/shared/interfaces/checklist-item';

@Component({
  selector: 'app-checklist-item-list',
  standalone: true,
  imports: [],
  template: `
    <section>
      <ul>
        @for (item of checklistItems; track item.id) {
        <li>
          @if(item.checked) {
          <span>✅</span>
          } @else {
          <span>❌</span>
          }
          <div>{{ item.title }}</div>
          <div><button (click)="toggle.emit(item.id)">Toggle</button></div>
        </li>
        } @empty {
        <li>
          <h2>No Items</h2>
          <div>
            Click the add button to add yout first item to this quicklist
          </div>
        </li>
        }
      </ul>
    </section>
  `,
  styles: ``,
})
export class ChecklistItemListComponent {
  @Input({ required: true }) checklistItems!: ChecklistItem[];
  @Output() toggle = new EventEmitter<string>();
}
