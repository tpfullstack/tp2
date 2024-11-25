import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EventListComponent } from './components/event-list/event-list.component';
import { ArtistsListComponent } from './components/artists-list/artists-list.component';
import { CreateEventComponent } from './components/create-event/create-event.component';
import { HeaderComponent } from './components/header/header.component';
import { EventDetailComponent } from './components/event-details/event-details.component';
import { ArtistDetailComponent } from './components/artist-details/artist-details.component';
import { CreateArtistComponent } from './components/create-artist/create-artist.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CreateArtistComponent, ArtistsListComponent, EventListComponent, CreateEventComponent, HeaderComponent, ArtistDetailComponent, EventDetailComponent], // Ajouter EventListComponent ici
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'GEA';
}
