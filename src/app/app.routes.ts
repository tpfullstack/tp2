import { Route } from '@angular/router';
import { EventListComponent } from './components/event-list/event-list.component'; // Exemple

export const routes: Route[] = [
  {
    path: 'events',
    component: EventListComponent  // Exemple de route
  },
  {
    path: '',
    redirectTo: '/events',
    pathMatch: 'full'  // Redirection vers la route par défaut
  }
];
