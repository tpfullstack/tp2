import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { EventService } from '../../services/event.service';
import { ArtistService } from '../../services/artist.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css'],
})
export class CreateEventComponent implements OnInit {
  newEvent = {
    label: '',
    startDate: '',
    endDate: '',
  };
  artists: any[] = [];
  selectedArtistIds: string[] = [];
  showPopin: boolean = false;
  popinMessage: string = '';
  isStartDateValid: boolean = true;
  isEndDateValid: boolean = true;

  constructor(
    private eventService: EventService,
    private artistService: ArtistService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadArtists();
  }

  loadArtists(): void {
    this.artistService.getArtists(0, 100).subscribe(
      (data) => {
        this.artists = data.content || [];
        this.cdr.detectChanges();
      },
      (error) => {
        this.showMessage('Erreur lors du chargement des artistes.');
      }
    );
  }

  showMessage(message: string): void {
    this.popinMessage = message;
    this.showPopin = true;
    this.cdr.detectChanges();
  }

  closePopin(): void {
    this.showPopin = false;
  }

  checkFutureDate(dateType: 'startDate' | 'endDate'): void {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const selectedDate = new Date(this.newEvent[dateType]);
    selectedDate.setHours(0, 0, 0, 0);

    if (dateType === 'startDate') {
      this.isStartDateValid = selectedDate >= currentDate;
    } else {
      this.isEndDateValid = selectedDate >= currentDate;
    }
  }

  createEvent(): void {
    if (this.newEvent.startDate > this.newEvent.endDate) {
      this.showMessage('La date de fin doit être après la date de début.');
      return;
    }

    if (!this.isStartDateValid || !this.isEndDateValid) {
      this.showMessage('Les dates doivent être dans le futur.');
      return;
    }

    this.newEvent.startDate = this.convertDateToApiFormat(this.newEvent.startDate);
    this.newEvent.endDate = this.convertDateToApiFormat(this.newEvent.endDate);

    this.eventService.createEvent(this.newEvent).subscribe(
      (eventResponse) => {
        if (this.selectedArtistIds.length > 0) {
          const artistLinkRequests = this.selectedArtistIds.map((artistId) =>
            this.eventService.linkArtistToEvent(eventResponse.id, artistId).toPromise()
          );

          Promise.all(artistLinkRequests)
            .then(() => {
              this.eventService.setGlobalMessage('Événement créé avec succès.');
              this.router.navigate(['/events']);
            })
            .catch(() => {
              this.showMessage('Erreur lors de l\'association des artistes à l\'événement.');
            });
        } else {
          this.eventService.setGlobalMessage('Événement créé avec succès.');
          this.router.navigate(['/events']);
        }
      },
      () => {
        this.showMessage('Erreur lors de la création de l\'événement.');
      }
    );
  }

  toggleArtistSelection(artistId: string): void {
    const index = this.selectedArtistIds.indexOf(artistId);
    if (index > -1) {
     
      this.selectedArtistIds.splice(index, 1);
    } else {
      
      this.selectedArtistIds.push(artistId);
    }
  }

  closeModal(): void {
    this.eventService.setGlobalMessage('Création d\'événement annulée.');
    this.router.navigate(['/events']);
  }

  convertDateToApiFormat(date: string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}