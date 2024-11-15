import { Route } from '@angular/router';
import { EventListComponent } from './components/event-list/event-list.component'; // Exemple
import { ArtistsListComponent } from './components/artists-list/artists-list.component'; // Nouvelle importation
import { CreateEventComponent } from './components/create-event/create-event.component';
export const routes: Route[] = [
  {
    path: 'events',
    component: EventListComponent  // Exemple de route
  },
  {
    path: 'create-event',
    component: CreateEventComponent  // Exemple de route
  },
  {
    path: 'artists', // Route pour la liste des artistes
    component: ArtistsListComponent
  },
  {
    path: '',
    redirectTo: '/create-event',
    pathMatch: 'full'  // Redirection vers la route par défaut
  }
];
