import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EventListComponent } from './components/event-list/event-list.component';
import { ArtistsListComponent } from './components/artists-list/artists-list.component';
import { CreateEventComponent } from './components/create-event/create-event.component';
import { HeaderComponent } from './components/header/header.component';
import { EventDetailComponent } from './components/event-details/event-details.component';
import { ArtistDetailComponent } from './components/artist-details/artist-details.component';
import { ErrorModalComponent } from './components/error-modal/error-modal.component'; // Importer le modal d'erreur
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component'; // Importer le composant 404
import { CreateArtistComponent } from './components/create-artist/create-artist.component';
import { Error500Component } from './components/error-500/error-500.component'; // Importez le nouveau composant

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CreateArtistComponent,
    ErrorModalComponent, // Assurez-vous que ce composant est autonome
    PageNotFoundComponent, // Assurez-vous que ce composant est autonome
    ArtistsListComponent,
    EventListComponent,
    CreateEventComponent,
    Error500Component,
    HeaderComponent,
    ArtistDetailComponent,
    EventDetailComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'GEA';
}