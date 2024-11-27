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
  selectedEvent: any = null;
  availableArtists: any[] = [];
  eventId: string = '';

  constructor(
    private eventService: EventService,
    private artistService: ArtistService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.eventId = params['id'];
      this.loadEventDetails(this.eventId);
    });
    this.loadAvailableArtists();
  }
  showPopin: boolean = false;
  popinMessage: string = '';
  loadEventDetails(eventId: string): void {
    this.eventService.getEventById(eventId).subscribe(
      (data) => {
        this.selectedEvent = {
          ...data,
          startDate: this.normalizeDate(data.startDate),
          endDate: this.normalizeDate(data.endDate)
        };
      },
      (error) => {
        this.showMessage('Impossible de récupérer les détails.');
      }
    );
  }
  
  normalizeDate(date: string): string {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  }
  
  

  loadAvailableArtists(): void {
    this.artistService.getArtists(0, 100).subscribe(
      (data) => {
        this.availableArtists = data.content || [];
      }
    );
  }

  
  updateEvent(): void {
    if (new Date(this.selectedEvent.startDate) > new Date(this.selectedEvent.endDate)) {
      this.showMessage('La date de fin doit être après la date de début.');
      return;
    }
  
    if (this.selectedEvent) {
      const updatedEvent = {
        label: this.selectedEvent.label,
        startDate: this.convertDateToApiFormat(new Date(this.selectedEvent.startDate)),
        endDate: this.convertDateToApiFormat(new Date(this.selectedEvent.endDate))
      };  
      this.eventService.updateEvent(this.eventId, updatedEvent).subscribe(
        (response) => {
          this.eventService.setGlobalMessage('Événement mis à jour avec succès.');
          this.router.navigate(['/events']);
        },
        (error) => {
          this.showMessage(`Erreur lors de la mise à jour de l'événement: ${error.message}`);
        }
      );
    }
  }

  showMessage(message: string): void {
    this.popinMessage = message;
    this.showPopin = true;
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

  convertDateToApiFormat(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Les mois commencent à 0
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  closePopin(): void {
    this.showPopin = false;
  }
  compareDates(date1: string, date2: string): boolean {
    return new Date(date1) > new Date(date2);
  }

  closeModal(): void {
    this.eventService.setGlobalMessage('Modification annulée.');
    this.router.navigate(['/events']);
  }
}
