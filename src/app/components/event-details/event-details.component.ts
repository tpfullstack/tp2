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
      (data) => this.selectedEvent = data,
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

  isArtistAssociated(artistId: string): boolean {
    return this.selectedEvent?.artists?.some((a: any) => a.id === artistId) || false;
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

  closeModal(): void {
    this.selectedEvent = null;
    this.router.navigate(['/events']);
  }
}
