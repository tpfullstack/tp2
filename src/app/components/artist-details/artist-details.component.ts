import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtistService } from '../../services/artist.service';
import { EventService } from '../../services/event.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-artist-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './artist-details.component.html',
  styleUrls: ['./artist-details.component.css']
})
export class ArtistDetailComponent implements OnInit {
  selectedArtist: any = null;
  availableEvents: any[] = [];
  artistId: string = '';
  showPopin: boolean = false;
  popinMessage: string = '';

  constructor(
    private artistService: ArtistService,
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.artistId = params['id'];
      this.loadArtistDetails(this.artistId);
    });
    this.loadAvailableEvents();
  }

  loadArtistDetails(artistId: string): void {
    this.artistService.getArtistById(artistId).subscribe(
      (data) => {
        if (data) {
          this.selectedArtist = data;
          this.updateAvailableEventsStatus();
        } else {
          this.artistService.setGlobalMessage('L\'artiste demandé n\'existe pas.');
          this.router.navigate(['/artists']);
        }
      },
      (error) => {
        this.artistService.setGlobalMessage('404 : Ressource non trouvée.');
        this.router.navigate(['/artists']);
      }
    );
  }

  loadAvailableEvents(): void {
    this.eventService.getEvents(0, 100).subscribe(
      (data) => {
        this.availableEvents = data.content || [];
        this.updateAvailableEventsStatus();
      },
      (error) => {
        this.showMessage('Erreur lors du chargement des événements disponibles.');
      }
    );
  }

  updateAvailableEventsStatus(): void {
    if (this.selectedArtist && this.selectedArtist.events && this.availableEvents.length > 0) {
      this.availableEvents.forEach(event => {
        event.associated = this.selectedArtist.events.some((artistEvent: any) => artistEvent.id === event.id);
      });
    }
  }

  updateArtist(): void {
    if (this.selectedArtist) {
      const updatedArtist = {
        label: this.selectedArtist.label
      };
      this.artistService.updateArtist(this.artistId, updatedArtist).subscribe(
        (response) => {
          this.artistService.setGlobalMessage('Artiste mis à jour avec succès.');
          this.router.navigate(['/artists']);
        },
        (error) => {
          if (error.status === 404) {
            this.showMessage(' 404 - Ressource non trouvée.');
          } else {
            this.showMessage(`Erreur lors de la mise à jour de l'artiste: ${error.message}`);
          }
        }
      );
    }
  }

  toggleAssociation(event: any): void {
    if (event.associated) {
      this.detachEvent(this.artistId, event.id);
    } else {
      this.attachEvent(this.artistId, event.id);
    }
  }

  attachEvent(artistId: string, eventId: string): void {
    this.eventService.linkArtistToEvent(eventId, artistId).subscribe({
      next: () => {
        console.log(`Événement ${eventId} associé.`);
        const event = this.availableEvents.find(e => e.id === eventId);
        if (event) {
          event.associated = true;
        }
        this.showMessage('Événement associé avec succès.');
      },
      error: (err) => {
        if (err.status === 404) {
          this.showMessage('L\'artiste ou l\'événement n\'existe pas.');
        } else {
          this.showMessage('Erreur lors de l\'association de l\'événement.');
        }
      }
    });
  }

  detachEvent(artistId: string, eventId: string): void {
    this.eventService.unlinkArtistFromEvent(eventId, artistId).subscribe({
      next: () => {
        console.log(`Événement ${eventId} dissocié.`);
        const event = this.availableEvents.find(e => e.id === eventId);
        if (event) {
          event.associated = false;
        }
        this.showMessage('Événement dissocié avec succès.');
      },
      error: (err) => {
        if (err.status === 404) {
          this.showMessage('L\'artiste ou l\'événement n\'existe pas.');
        } else {
          this.showMessage('Erreur lors de la dissociation de l\'événement.');
        }
      }
    });
  }

  showMessage(message: string): void {
    this.popinMessage = message;
    this.showPopin = true;
    setTimeout(() => this.closePopin(), 2500);
  }

  closePopin(): void {
    this.showPopin = false;
  }

  closeModal(): void {
    this.artistService.setGlobalMessage('Modification annulée.');
    this.router.navigate(['/artists']);
  }
}