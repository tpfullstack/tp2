import { Route } from '@angular/router';
import { EventListComponent } from './components/event-list/event-list.component'; // Exemple
import { ArtistsListComponent } from './components/artists-list/artists-list.component'; // Nouvelle importation
import { CreateArtistComponent } from './components/create-artist/create-artist.component'; // Composant Create Artist
import { EventDetailComponent } from './components/event-details/event-details.component'; // Corrigez le nom ici
import { ArtistDetailComponent } from './components/artist-details/artist-details.component';  // Importation du composant Détail
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
  { path: 'events/:id', 
  component: EventDetailComponent },
  {
    path: 'artists/:id',  // Route pour afficher les détails d'un artiste
    component: ArtistDetailComponent
  },
  {
    path: 'create-artist',
    component: CreateArtistComponent  // Route vers le composant Create Artist
  },
  {
    path: '',
    redirectTo: '/artists',
    pathMatch: 'full'  // Redirection vers la route par défaut
  }
];
