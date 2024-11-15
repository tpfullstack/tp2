import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EventListComponent } from './components/event-list/event-list.component'; // Assurez-vous du bon chemin

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EventListComponent], // Ajouter EventListComponent ici
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'GEA';
}
