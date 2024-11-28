import { Component } from '@angular/core';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [ErrorModalComponent],
  templateUrl: './page-not-found.component.html',
})
export class PageNotFoundComponent {}