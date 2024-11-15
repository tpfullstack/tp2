import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { CommonModule } from '@angular/common';  // Import pour les directives *ngIf, *ngFor
import { FormsModule } from '@angular/forms'; 
@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  events: any[] = [];
  selectedEvent: any = null;
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
  decrementPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadEvents();
    }
  }

  incrementPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadEvents();
    }
  }

  editEvent(event: any): void {
    console.log('Édition de l\'événement :', event);
  }
  detailsEvent(eventId: string): void {
    this.eventService.getEventById(eventId).subscribe(
      (event) => {
        this.selectedEvent = event;
      },
      (error) => {
        console.error('Erreur lors de la récupération des détails de l\'événement', error);
      }
    );
  }

  updateEvent(): void {
    if (this.selectedEvent) {
      this.eventService.updateEvent(this.selectedEvent.id, this.selectedEvent).subscribe(
        (response) => {
          console.log('Événement mis à jour avec succès', response);
          this.loadEvents();  // Recharge la liste des événements après mise à jour
          this.selectedEvent = null;  // Ferme la vue des détails
        },
        (error) => {
          console.error('Erreur lors de la mise à jour de l\'événement', error);
        }
      );
    }
  }

  deleteEvent(eventId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      this.eventService.deleteEventById(eventId).subscribe(
        () => {
          console.log('Événement supprimé avec succès');
          this.loadEvents();  // Recharge la liste après suppression
        },
        (error) => {
          console.error('Erreur lors de la suppression de l\'événement', error);
        }
      );
    }
  }
}
