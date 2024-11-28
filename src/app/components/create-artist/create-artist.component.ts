import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ArtistService } from '../../services/artist.service';
import { EventService } from '../../services/event.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-artist',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-artist.component.html',
  styleUrls: ['./create-artist.component.css']
})
export class CreateArtistComponent implements OnInit {
  newArtist = {
    label: '',
  };
  events: any[] = [];
  selectedEventIds: string[] = [];
  showPopin: boolean = false;
  popinMessage: string = '';

  constructor(
    private artistService: ArtistService,
    private eventService: EventService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getEvents(0, 100).subscribe(
      (data) => {
        this.events = data.content || [];
        this.cdr.detectChanges();
      },
      (error) => {
        this.showMessage('Erreur lors du chargement des événements.');
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

  createArtist(): void {
    this.artistService.createArtist(this.newArtist).subscribe(
      (artistResponse) => {
        if (this.selectedEventIds.length > 0) {
          const eventLinkRequests = this.selectedEventIds.map((eventId) =>
            this.eventService.linkArtistToEvent(eventId, artistResponse.id).toPromise()
          );

          Promise.all(eventLinkRequests)
            .then(() => {
              this.artistService.setGlobalMessage('Artiste créé avec succès.');
              this.router.navigate(['/artists']);
            })
            .catch(() => {
              this.showMessage('Erreur lors de l\'association des événements à l\'artiste.');
            });
        } else {
          this.artistService.setGlobalMessage('Artiste créé avec succès.');
          this.router.navigate(['/artists']);
        }
      },
      () => {
        this.showMessage('Erreur lors de la création de l\'artiste.');
      }
    );
  }

  toggleEventSelection(eventId: string): void {
    const index = this.selectedEventIds.indexOf(eventId);
    if (index > -1) {
      // Si l'événement est déjà sélectionné, le retirer
      this.selectedEventIds.splice(index, 1);
    } else {
      // Sinon, ajouter l'événement à la sélection
      this.selectedEventIds.push(eventId);
    }
  }

  closeModal(): void {
    this.artistService.setGlobalMessage('Création d\'artiste annulée.');
    this.router.navigate(['/artists']);
  }
}