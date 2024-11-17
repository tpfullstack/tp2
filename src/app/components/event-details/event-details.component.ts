import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { ArtistService } from '../../services/artist.service';
import { Router, ActivatedRoute } from '@angular/router';  // Ajout du Router et ActivatedRoute
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
  selectedEvent: any = null;
  availableArtists: any[] = [];  // Liste des artistes disponibles pour l'ajout
  selectedArtistId: string = '';  // ID de l'artiste à associer
  eventId: string = '';  // ID de l'événement sélectionné

  constructor(
    private eventService: EventService,
    private artistService: ArtistService,
    private router: Router,
    private route: ActivatedRoute  // Récupérer l'ID de l'événement depuis l'URL
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.eventId = params['id'];  // Récupérer l'ID de l'événement depuis l'URL
      this.loadEventDetails(this.eventId);
    });
    this.loadAvailableArtists();  // Charger les artistes disponibles au démarrage
  }

  loadEventDetails(eventId: string): void {
    this.eventService.getEventById(eventId).subscribe(
      (data) => {
        this.selectedEvent = data; 
        console.log('Détails de l\'événement récupérés:', this.selectedEvent);
  
        // Vérifier si la date est déjà au format correct
        if (this.selectedEvent) {
          // Si les dates sont déjà au format yyyy-MM-dd, pas besoin de les convertir
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
  
  convertDateToApiFormat(date: string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
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

  attachArtist(eventId: string, artistId: string): void {
    if (!artistId) {
      alert('Veuillez sélectionner un artiste à associer.');
      return;
    }
    this.eventService.linkArtistToEvent(eventId, artistId).subscribe({
      next: () => {
        alert('Artiste associé avec succès.');
        this.loadEventDetails(eventId); // Recharge les détails de l'événement
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
          this.loadEventDetails(eventId);  // Recharge les détails de l'événement après détachement
        },
        (error) => {
          console.error('Erreur lors du détachement de l\'artiste', error);
        }
      );
    }
  }

  updateEvent(): void {
    if (this.selectedEvent) {
      this.eventService.updateEvent(this.selectedEvent.id, this.selectedEvent).subscribe(
        (response) => {
          console.log('Événement mis à jour avec succès', response);
          this.selectedEvent = null;  // Ferme la vue des détails après mise à jour
          this.router.navigate(['/events']);  // Redirige vers la liste des événements
        },
        (error) => {
          console.error('Erreur lors de la mise à jour de l\'événement', error);
        }
      );
    }
  }

  closeModal(): void {
    this.selectedEvent = null; // Ferme la modal
    this.router.navigate(['/events']);  // Redirige vers la liste des événements
  }
  
}
