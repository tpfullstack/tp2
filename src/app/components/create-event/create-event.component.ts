import { Component } from '@angular/core';
import { EventService } from '../../services/event.service';  // Importez le service
import { Router } from '@angular/router';  // Importez le router pour rediriger après la création
import { FormsModule } from '@angular/forms'; 
@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent {
  newEvent = {
    label: '',
    startDate: '',
    endDate: ''
  };

  constructor(private eventService: EventService, private router: Router) {}

  // Méthode pour envoyer les données au backend
  createEvent(): void {
    // Conversion des dates avant l'envoi si nécessaire
    this.newEvent.startDate = this.convertDateToApiFormat(this.newEvent.startDate);
    this.newEvent.endDate = this.convertDateToApiFormat(this.newEvent.endDate);

    // Appel à l'API pour créer l'événement
    this.eventService.createEvent(this.newEvent).subscribe(
      (response) => {
        console.log('Événement créé avec succès', response);
        this.router.navigate(['/events']);  // Redirection vers la liste des événements
      },
      (error) => {
        console.error('Erreur lors de la création de l\'événement', error);
      }
    );
  }

  // Méthode de conversion des dates au format yyyy-MM-dd
  convertDateToApiFormat(date: string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
