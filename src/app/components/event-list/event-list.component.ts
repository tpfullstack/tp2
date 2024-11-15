

import { CommonModule } from '@angular/common'; // Importer CommonModule
import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  events: any[] = [];
  currentPage: number = 0;
  pageSize: number = 5;
  totalPages: number = 0;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getEvents(this.currentPage, this.pageSize).subscribe(
      (data) => {
        this.events = data.content;
        this.totalPages = data.totalPages;
      },
      (error) => {
        console.error('Erreur lors de la récupération des événements', error);
      }
    );
  }

  // Méthode pour changer de page (précédent)
  decrementPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadEvents();
    }
  }

  // Méthode pour changer de page (suivant)
  incrementPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadEvents();
    }
  }
    // Méthode pour éditer un événement
    editEvent(event: any): void {
      console.log('Édition de l\'événement :', event);
      // Ici, tu peux rediriger vers un formulaire d'édition ou ouvrir un modal
      // Par exemple : this.router.navigate(['/edit-event', event.id]);
    }
  
    // Méthode pour supprimer un événement
    deleteEvent(eventId: string): void {
      
    }
    // Méthode pour supprimer un événement
    detailsEvent(eventId: string): void {
      
    }
}
