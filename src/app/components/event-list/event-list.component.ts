import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventService } from '../../services/event.service';
import { ArtistService } from '../../services/artist.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit, OnDestroy {
  events: any[] = [];
  availableArtists: any[] = [];
  selectedEvent: any = null;
  selectedArtistId: string = '';
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;

  showPopin: boolean = false;
  showDeleteConfirmation: boolean = false;
  popinMessage: string = '';
  eventToDeleteId: string | null = null;

  private messageSubscription: Subscription;

  constructor(
    private eventService: EventService,
    private artistService: ArtistService,
    private router: Router
  ) {
    this.messageSubscription = this.eventService.getGlobalMessage().subscribe(message => {
      if (message) {
        this.showMessage(message);
      }
    });
  }

  ngOnInit(): void {
    this.loadEvents();
    this.loadAvailableArtists();
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }

  showMessage(message: string): void {
    this.popinMessage = message;
    this.showPopin = true;
    setTimeout(() => {
      this.closePopin();
    }, 2500);
  }

  closePopin(): void {
    this.showPopin = false;
  }

  loadEvents(): void {
    this.eventService.getEvents(this.currentPage, this.pageSize).subscribe(
      (data) => {
        this.events = data.content.map((event: any) => ({
          ...event,
          artists: event.artists || []
        }));
        this.totalPages = data.totalPages;
      },
      (error) => {
        this.showMessage('Erreur lors de la récupération des événements');
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
        this.showMessage('Erreur lors de la récupération des artistes disponibles');
      }
    );
  }

  deleteEvent(eventId: string): void {
    this.eventToDeleteId = eventId;
    this.showDeleteConfirmation = true;
  }

  confirmDeleteEvent(): void {
    if (this.eventToDeleteId) {
      this.eventService.deleteEventById(this.eventToDeleteId).subscribe(
        () => {
          this.showDeleteConfirmation = false;
          this.showMessage('Événement supprimé avec succès');
          this.loadEvents();
        },
        (error) => {
          this.showDeleteConfirmation = false;
          this.showMessage('Erreur lors de la suppression de l\'événement');
        }
      );
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirmation = false;
    this.eventToDeleteId = null;
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