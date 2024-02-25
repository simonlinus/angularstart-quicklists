import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Checklist } from 'src/app/shared/interfaces/checklist';

@Component({
  selector: 'app-checklist-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <ul>
      @for (checklist of checklists; track checklist.id) {
      <li>
        <a routerLink="/checklist/{{ checklist.id }}">
          {{ checklist.title }}
        </a>
      </li>
      } @empty {
      <li>Empty here</li>
      }
    </ul>
  `,
  styles: ``,
})
export class ChecklistListComponent {
  @Input({ required: true }) checklists: Checklist[] = [];
}
