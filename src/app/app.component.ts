import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EventListComponent } from './components/event-list/event-list.component'; // Assurez-vous du bon chemin
import { CreateEventComponent } from './components/create-event/create-event.component';
import { HeaderComponent } from './components/header/header.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EventListComponent, CreateEventComponent, HeaderComponent ], // Ajouter EventListComponent ici
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'GEA';
}
