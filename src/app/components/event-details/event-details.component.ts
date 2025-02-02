import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  showPopin: boolean = false;
  popinMessage: string = '';
  isStartDateValid: boolean = true;
  isEndDateValid: boolean = true;
  artists: any[] = [];
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

  loadEventDetails(eventId: string): void {
    this.eventService.getEventById(eventId).subscribe(
      (data) => {
        if (data) {
          this.selectedEvent = {
            ...data,
            startDate: this.normalizeDate(data.startDate),
            endDate: this.normalizeDate(data.endDate)
          };
          this.loadAvailableArtists(); 
          this.checkFutureDate('startDate');
          this.checkFutureDate('endDate');
        } else {
          this.eventService.setGlobalMessage('404 : Ressource non trouvée.');
          this.router.navigate(['/events']);
        }
      },
      (error) => {
        this.eventService.setGlobalMessage('404 : Ressource non trouvée.');
        this.router.navigate(['/events']);
      }
    );
  }

  normalizeDate(date: string): string {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  }


  loadAvailableArtists(): void {
    const filterParams = {};
    const pageable = {
      page: 0,
      size: 1000000,
      sort: ['label,asc']
    };
  
    this.artistService.getArtists(filterParams, pageable).subscribe(
      (data) => {
        this.availableArtists = data.content || [];
        this.updateAvailableArtistsStatus();
      }
    );
  }

  updateAvailableArtistsStatus(): void {
    if (this.selectedEvent && this.selectedEvent.artists && this.availableArtists.length > 0) {
      this.availableArtists.forEach(artist => {
        artist.associated = this.selectedEvent.artists.some((eventArtist: any) => eventArtist.id === artist.id);
      });
    }
  }

  checkFutureDate(dateType: 'startDate' | 'endDate'): void {
    if (!this.selectedEvent || !this.selectedEvent[dateType]) return;

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const selectedDate = new Date(this.selectedEvent[dateType]);
    selectedDate.setHours(0, 0, 0, 0);

    if (dateType === 'startDate') {
      this.isStartDateValid = selectedDate >= currentDate;
    } else {
      this.isEndDateValid = selectedDate >= currentDate;
    }
  }

  updateEvent(): void {
    if (new Date(this.selectedEvent.startDate) > new Date(this.selectedEvent.endDate)) {
      this.showMessage('La date de fin doit être après la date de début.');
      return;
    }
  
    if (!this.isStartDateValid || !this.isEndDateValid) {
      this.showMessage('Les dates doivent être dans le futur.');
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
          if (error.status === 404) {
            this.showMessage('L\'événement à mettre à jour n\'existe pas.');
          } else {
            this.showMessage(`Erreur lors de la mise à jour de l'événement: ${error.message}`);
          }
        }
      );
    }
  }

  toggleAssociation(artist: any): void {
    if (artist.associated) {
      this.detachArtist(this.eventId, artist.id);
    } else {
      this.attachArtist(this.eventId, artist.id);
    }
  }

  attachArtist(eventId: string, artistId: string): void {
    this.eventService.linkArtistToEvent(eventId, artistId).subscribe({
      next: () => {
        console.log(`Artiste ${artistId} associé.`);
        const artist = this.availableArtists.find(a => a.id === artistId);
        if (artist) {
          artist.associated = true;
        }
        this.showMessage('Artiste associé avec succès.');
      },
      error: (err) => {
        if (err.status === 404) {
          this.showMessage('L\'événement ou l\'artiste n\'existe pas.');
        } else {
          this.showMessage('Erreur lors de l\'association de l\'artiste.');
        }
      }
    });
  }

  detachArtist(eventId: string, artistId: string): void {
    this.eventService.unlinkArtistFromEvent(eventId, artistId).subscribe({
      next: () => {
        console.log(`Artiste ${artistId} dissocié.`);
        const artist = this.availableArtists.find(a => a.id === artistId);
        if (artist) {
          artist.associated = false;
        }
        this.showMessage('Artiste dissocié avec succès.');
      },
      error: (err) => {
        if (err.status === 404) {
          this.showMessage('L\'événement ou l\'artiste n\'existe pas.');
        } else {
          this.showMessage('Erreur lors de la dissociation de l\'artiste.');
        }
      }
    });
  }

  convertDateToApiFormat(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  showMessage(message: string): void {
    this.popinMessage = message;
    this.showPopin = true;
    setTimeout(() => this.closePopin(), 2500);
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