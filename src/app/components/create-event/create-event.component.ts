import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { ArtistService } from '../../services/artist.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {
  newEvent = {
    label: '',
    startDate: '',
    endDate: ''
  };
  artists: any[] = [];
  selectedArtistIds: string[] = [];

  constructor(
    private eventService: EventService,
    private artistService: ArtistService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadArtists();
  }
  loadArtists(): void {
    this.artistService.getArtists(0, 100).subscribe(
      (data) => {
        console.log('Données artistes récupérées :', data.content);
        this.artists = data.content || [];
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Erreur lors de la récupération des artistes', error);
      }
    );
  }

  createEvent(): void {
    this.newEvent.startDate = this.convertDateToApiFormat(this.newEvent.startDate);
    this.newEvent.endDate = this.convertDateToApiFormat(this.newEvent.endDate);

    this.eventService.createEvent(this.newEvent).subscribe(
      (eventResponse) => {
        console.log('Événement créé avec succès', eventResponse);

        if (this.selectedArtistIds.length > 0) {
          console.log('Association des artistes avec les IDs :', this.selectedArtistIds);
          this.selectedArtistIds.forEach((artistId) => {
            this.eventService.linkArtistToEvent(eventResponse.id, artistId).subscribe(
              () => {
                console.log('Artiste associé à l\'événement avec succès');
              },
              (error) => {
                console.error('Erreur lors de l\'association de l\'artiste', error);
              }
            );
          });

          this.router.navigate(['/events']);
        } else {
          this.router.navigate(['/events']);
        }
      },
      (error) => {
        console.error('Erreur lors de la création de l\'événement', error);
      }
    );
  }

  closeModal(): void {
    this.router.navigate(['/events']);
  }

  // Convertir les dates au format API (yyyy-MM-dd)
  convertDateToApiFormat(date: string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
