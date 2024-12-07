import { Component, OnInit } from '@angular/core';
import { ArtistService } from '../../services/artist.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorModalComponent } from '../error-modal/error-modal.component';

@Component({
  selector: 'app-artists-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ErrorModalComponent], 
  templateUrl: './artists-list.component.html',
  styleUrls: ['./artists-list.component.css']
})
export class ArtistsListComponent implements OnInit {
  artists: any[] = [];
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;
  searchTerm: string = '';
  sortColumn: string = 'label';
  sortDirection: 'asc' | 'desc' = 'asc';

  showPopin: boolean = false;
  popinMessage: string = '';
  showDeleteConfirmation: boolean = false;
  artistToDeleteId: string | null = null;

  constructor(private artistService: ArtistService, private router: Router) {}

  ngOnInit(): void {
    this.loadArtists();
    const message = this.artistService.getGlobalMessage();
    if (message) {
      this.showMessage(message);
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

  loadArtists(): void {
    const filterParams = this.searchTerm ? { label: this.searchTerm } : {};
    const pageable = {
      page: this.currentPage,
      size: this.pageSize,
      sort: [`${this.sortColumn},${this.sortDirection}`]
    };

    this.artistService.getArtists(filterParams, pageable).subscribe(
      (data) => {
        this.artists = data.content;
        this.totalPages = data.totalPages;
        this.totalElements = data.totalElements;
      },
      (error) => {
        this.router.navigate(['/server-error']);
      }
    );
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadArtists();
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.loadArtists();
  }

  decrementPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadArtists();
    }
  }

  incrementPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadArtists();
    }
  }

  navigateToAddArtist(): void {
    this.router.navigate(['/create-artist']);
  }

  navigateToDetail(artistId: string): void {
    this.router.navigate([`/artists/${artistId}`]);
  }

  deleteArtist(artistId: string): void {
    this.artistToDeleteId = artistId;
    this.showDeleteConfirmation = true;
  }

  confirmDeleteArtist(): void {
    if (this.artistToDeleteId) {
      this.artistService.deleteArtistById(this.artistToDeleteId).subscribe(
        () => {
          this.loadArtists();
          this.showMessage('L\'artiste a été supprimé avec succès.');
          this.closeDeleteConfirmation();
        },
        () => {
          this.showMessage('Erreur lors de la suppression de l\'artiste.');
          this.closeDeleteConfirmation();
        }
      );
    }
  }

  closeDeleteConfirmation(): void {
    this.showDeleteConfirmation = false;
    this.artistToDeleteId = null;
  }
}