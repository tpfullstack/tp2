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

  constructor(
    private eventService: EventService,
    private artistService: ArtistService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadEvents();
    this.loadAvailableArtists();
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
          this.loadEvents();
          this.selectedEvent = null;
        },
        (error) => {
          console.error('Erreur lors de la mise à jour de l\'événement', error);
        }
      );
    }
  }
  loadEventDetails(eventId: string): void {
    this.eventService.getEventById(eventId).subscribe(
      (data) => {
        this.selectedEvent = data;
        console.log('Détails de l\'événement récupérés:', this.selectedEvent);

        if (this.selectedEvent) {
          this.selectedEvent.startDate = this.selectedEvent.startDate || '';
          this.selectedEvent.endDate = this.selectedEvent.endDate || '';
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des détails de l\'événement :', error);
        alert('Impossible de récupérer les détails de l\'événement.');
      }
    );
  }


  attachArtist(eventId: string, artistId: string): void {
    if (!artistId) {
      alert('Veuillez sélectionner un artiste à associer.');
      return;
    }

    this.eventService.linkArtistToEvent(eventId, artistId).subscribe({
      next: () => {
        alert('Artiste associé avec succès.');
        this.loadEventDetails(eventId);
      },
      error: (err) => {
        console.error('Erreur lors de l\'association de l\'artiste :', err);
        alert('Impossible d\'associer l\'artiste.');
      },
    });
  }


  detachArtist(eventId: string, artistId: string): void {
    if (artistId) {
      this.eventService.unlinkArtistFromEvent(eventId, artistId).subscribe(
        () => {
          console.log('Artiste détaché de l\'événement');
          this.loadEvents();
        },
        (error) => {
          console.error('Erreur lors du détachement de l\'artiste', error);
        }
      );
    }
  }

  closeModal(): void {
    this.selectedEvent = null;
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

  deleteEvent(eventId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      this.eventService.deleteEventById(eventId).subscribe(
        () => {
          console.log('Événement supprimé avec succès');
          this.loadEvents();
        },
        (error) => {
          console.error('Erreur lors de la suppression de l\'événement', error);
        }
      );
    }
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
