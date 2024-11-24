import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { ArtistService } from '../../services/artist.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailComponent implements OnInit {
  selectedEvent: any = null; // Événement sélectionné
  availableArtists: any[] = []; // Liste des artistes disponibles
  eventId: string = ''; // ID de l'événement

  constructor(
    private eventService: EventService,
    private artistService: ArtistService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.eventId = params['id'];
      this.loadEventDetails(this.eventId); // Charger les détails de l'événement
    });
    this.loadAvailableArtists(); // Charger la liste des artistes
  }

  loadEventDetails(eventId: string): void {
    this.eventService.getEventById(eventId).subscribe(
      (data) => {
        this.selectedEvent = data;

        // Normaliser les dates au format yyyy-MM-dd
        this.selectedEvent.startDate = this.normalizeDate(this.selectedEvent.startDate);
        this.selectedEvent.endDate = this.normalizeDate(this.selectedEvent.endDate);
        
        // Convertir les dates en objets Date pour une meilleure comparaison
        this.selectedEvent.startDate = new Date(this.selectedEvent.startDate);
        this.selectedEvent.endDate = new Date(this.selectedEvent.endDate);
      },
      (error) => {
        console.error('Erreur :', error);
        alert('Impossible de récupérer les détails.');
      }
    );
  }

  loadAvailableArtists(): void {
    this.artistService.getArtists(0, 100).subscribe(
      (data) => {
        this.availableArtists = data.content || [];
        console.log('Artistes disponibles chargés:', this.availableArtists);
      },
      (error) => {
        console.error('Erreur lors de la récupération des artistes disponibles', error);
        alert('Impossible de charger les artistes disponibles.');
      }
    );
  }

  normalizeDate(date: string): string {
    if (!date) return '';
    return date.split('T')[0]; // Garder uniquement la partie yyyy-MM-dd
  }

  updateEvent(): void {
    console.log('Start Date:', this.selectedEvent.startDate);
    console.log('End Date:', this.selectedEvent.endDate);

    // Validation des dates
    if (this.selectedEvent.startDate && this.selectedEvent.endDate) {
      // Comparer les dates en tant qu'objets Date
      if (this.selectedEvent.startDate > this.selectedEvent.endDate) {
        alert('La date de fin doit être après la date de début.');
        return;
      }
    }

    if (this.selectedEvent) {
      const updatedEvent = {
        ...this.selectedEvent,
        startDate: this.convertDateToApiFormat(this.selectedEvent.startDate), // Date normalisée
        endDate: this.convertDateToApiFormat(this.selectedEvent.endDate) // Date normalisée
      };

      this.eventService.updateEvent(this.eventId, updatedEvent).subscribe(
        (response) => {
          console.log('Événement mis à jour avec succès', response);
          this.selectedEvent = null;  // Ferme la vue des détails après mise à jour
          this.router.navigate(['/events']);  // Redirige vers la liste des événements
        },
        (error) => {
          console.error('Erreur lors de la mise à jour de l\'événement', error);
          alert('Erreur lors de la mise à jour de l\'événement.');
        }
      );
    }
  }

  toggleAssociation(artist: any): void {
    artist.associated = !artist.associated;

    if (artist.associated) {
      this.attachArtist(this.eventId, artist.id);
    } else {
      this.detachArtist(this.eventId, artist.id);
    }
  }

  attachArtist(eventId: string, artistId: string): void {
    this.eventService.linkArtistToEvent(eventId, artistId).subscribe({
      next: () => console.log(`Artiste ${artistId} associé.`),
      error: (err) => alert('Association échouée.')
    });
  }

  detachArtist(eventId: string, artistId: string): void {
    this.eventService.unlinkArtistFromEvent(eventId, artistId).subscribe({
      next: () => console.log(`Artiste ${artistId} dissocié.`),
      error: (err) => alert('Dissociation échouée.')
    });
  }

  // Convertir les dates au format API (yyyy-MM-dd)
  convertDateToApiFormat(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  closeModal(): void {
    this.selectedEvent = null;
    this.router.navigate(['/events']);
  }
}
