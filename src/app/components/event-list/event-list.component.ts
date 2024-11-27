import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { ArtistService } from '../../services/artist.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  events: any[] = [];
  availableArtists: any[] = [];
  selectedEvent: any = null;
  selectedArtistId: string = '';
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;

  showPopin: boolean = false; // Pour le message d'information
  showDeleteConfirmation: boolean = false; // Pour la confirmation de suppression
  popinMessage: string = '';
  eventToDeleteId: string | null = null; // ID de l'événement à supprimer

  constructor(
    private eventService: EventService,
    private artistService: ArtistService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadEvents();
    this.loadAvailableArtists();
    const message = this.eventService.getGlobalMessage();
    if (message) {
      this.showMessage(message);
    }
  }

  showMessage(message: string): void {
    this.popinMessage = message;
    this.showPopin = true; // Afficher la popin d'information
  }

  closePopin(): void {
    this.showPopin = false;
  }

  loadEvents(): void {
    this.eventService.getEvents(this.currentPage, this.pageSize).subscribe(
      (data) => {
        this.events = data.content;
        this.totalPages = data.totalPages;
      },
      (error) => {
        this.showMessage('Erreur lors de la récupération des événements');
      }
    );
  }

  loadAvailableArtists(): void {
    this.artistService.getArtists(0, 100).subscribe(
      (data) => {
        this.availableArtists = data.content || [];
      },
      (error) => {
        console.error('Erreur lors de la récupération des artistes disponibles', error);
        this.showMessage('Erreur lors de la récupération des artistes disponibles');
      }
    );
  }

  deleteEvent(eventId: string): void {
    this.eventToDeleteId = eventId; // Enregistrer l'ID à supprimer
    this.showDeleteConfirmation = true; // Afficher la popin de confirmation
  }

  confirmDeleteEvent(): void {
    if (this.eventToDeleteId) {
      this.eventService.deleteEventById(this.eventToDeleteId).subscribe(
        () => {
          this.showDeleteConfirmation = false; // Fermer la popin de confirmation
          this.showMessage('Événement supprimé avec succès'); // Afficher le message de succès
          this.loadEvents();
        },
        (error) => {
          this.showDeleteConfirmation = false; // Fermer la popin de confirmation
          this.showMessage('Erreur lors de la suppression de l\'événement');
        }
      );
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirmation = false;
    this.eventToDeleteId = null;
  }

  navigateToAddEvent(): void {
    this.router.navigate(['/create-event']);
  }

  decrementPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadEvents();
    }
  }

  navigateToDetail(event: any): void {
    this.router.navigate(['/events', event.id]);
  }

  incrementPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadEvents();
    }
  }
}