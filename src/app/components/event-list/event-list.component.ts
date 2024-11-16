import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { ArtistService } from '../../services/artist.service';
import { Router } from '@angular/router';  // Ajout du Router
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
  availableArtists: any[] = [];  // Liste des artistes disponibles pour l'ajout
  selectedEvent: any = null;
  selectedArtistId: string = '';  // ID de l'artiste à associer
  currentPage: number = 0;
  pageSize: number = 5;
  totalPages: number = 0;

  constructor(
    private eventService: EventService,
    private artistService: ArtistService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvents();
    this.loadAvailableArtists(); // Charger les artistes disponibles au démarrage
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

  loadAvailableArtists(): void {
    // Charger les artistes disponibles pour association
    this.artistService.getArtists(0, 100).subscribe(
      (data) => {
        this.availableArtists = data.content || [];
      },
      (error) => {
        console.error('Erreur lors de la récupération des artistes disponibles', error);
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

  attachArtist(eventId: string, artistId: string): void {
    if (artistId) {
      this.eventService.linkArtistToEvent(eventId, artistId).subscribe(
        () => {
          console.log('Artiste associé à l\'événement');
          this.loadEvents();  // Recharge la liste des événements après ajout
        },
        (error) => {
          console.error('Erreur lors de l\'association de l\'artiste', error);
        }
      );
    }
  }

  detachArtist(eventId: string, artistId: string): void {
    if (artistId) {
      this.eventService.unlinkArtistFromEvent(eventId, artistId).subscribe(
        () => {
          console.log('Artiste détaché de l\'événement');
          this.loadEvents();  // Recharge la liste des événements après suppression
        },
        (error) => {
          console.error('Erreur lors du détachement de l\'artiste', error);
        }
      );
    }
  }

  closeModal(): void {
    this.selectedEvent = null; // Ferme la modal
  }

  detailsEvent(eventId: string): void {
    this.eventService.getEventById(eventId).subscribe(
      (event) => {
        this.selectedEvent = event; // Ouvre la modal avec les détails de l'événement
      },
      (error) => {
        console.error('Erreur lors de la récupération des détails de l\'événement', error);
      }
    );
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

  navigateToAddEvent(): void {
    this.router.navigate(['/create-event']);  // Redirige vers la page d'ajout d'événement
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
}
