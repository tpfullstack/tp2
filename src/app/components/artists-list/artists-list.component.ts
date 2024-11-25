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
  selectedArtist: any = null;
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;

  constructor(private artistService: ArtistService, private router: Router) { }

  ngOnInit(): void {
    this.loadArtists();
  }
   // Éditer un artiste (ouvre les détails dans une modal ou une autre vue)
   editArtist(artist: any): void {
    console.log('Édition de l\'artiste :', artist);
  }

  loadArtists(): void {
    this.artistService.getArtists(this.currentPage, this.pageSize).subscribe(
      (data) => {
        this.artists = data.content;
        this.totalPages = data.totalPages;
      },
      (error) => {
        console.error('Erreur lors de la récupération des artistes', error);
      }
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


  updateArtist(): void {
    if (this.selectedArtist) {
      this.artistService.updateArtist(this.selectedArtist.id, this.selectedArtist).subscribe(
        (response) => {
          this.loadArtists();
          this.selectedArtist = null;
        },
        (error) => {
          console.error('Erreur lors de la mise à jour de l\'artiste', error);
        }
      );
    }
  }

  navigateToAddArtist(): void {
    this.router.navigate(['/create-artist']);
  }

  closeModal(): void {
    this.selectedArtist = null;
  }

  detailsArtist(artistId: string): void {
    this.artistService.getArtistById(artistId).subscribe(
      (artist) => {
        this.selectedArtist = artist;
      },
      (error) => {
        console.error('Erreur lors de la récupération des détails de l\'artiste', error);
      }
    );
  }
  navigateToDetail(artistId: string): void {
    this.router.navigate([`/artists/${artistId}`]);
  }
  deleteArtist(artistId: string): void {
    this.artistService.deleteArtistById(artistId).subscribe(() => {
      this.loadArtists();
    });
  }

}
