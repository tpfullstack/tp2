import { Component, OnInit } from '@angular/core';
import { ArtistService } from '../../services/artist.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-artists-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './artists-list.component.html',
  styleUrls: ['./artists-list.component.css']
})
export class ArtistsListComponent implements OnInit {
  artists: any[] = [];
  filteredArtists: any[] = [];
  selectedArtist: any = null;
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  searchTerm: string = '';

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
    }, 693); // Le message se fermera après 3 secondes
  }

  closePopin(): void {
    this.showPopin = false;
  }

  loadArtists(): void {
    this.artistService.getArtists(this.currentPage, this.pageSize).subscribe(
      (data) => {
        this.artists = data.content;
        this.filteredArtists = [...this.artists];
        this.totalPages = data.totalPages;
      },
      () => {
        this.showMessage('Erreur lors de la récupération des artistes.');
      }
    );
  }

  onSearch(): void {
    this.filteredArtists = this.artists.filter(artist =>
      artist.label.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
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

  closeModal(): void {
    this.artistService.setGlobalMessage('Modification annulée.');
    this.router.navigate(['/artists']);
  }

  detailsArtist(artistId: string): void {
    this.artistService.getArtistById(artistId).subscribe(
      (artist) => {
        this.selectedArtist = artist;
      },
      () => {
        this.showMessage('Erreur lors de la récupération des détails de l\'artiste.');
      }
    );
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