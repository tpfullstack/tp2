import { Component, OnInit } from '@angular/core';
import { ArtistService } from '../../services/artist.service';
import { CommonModule } from '@angular/common';  // Import pour les directives *ngIf, *ngFor
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';  // Ajout de l'import du Router

@Component({
  selector: 'app-artists-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './artists-list.component.html',
  styleUrls: ['./artists-list.component.css']
})
export class ArtistsListComponent implements OnInit {
  artists: any[] = [];
  selectedArtist: any = null; // Sélection d'un seul artiste
  currentPage: number = 0;
  pageSize: number = 5;
  totalPages: number = 0;

  constructor(private artistService: ArtistService, private router: Router) {}

  ngOnInit(): void {
    this.loadArtists();
  }

  // Charger les artistes avec pagination
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

  // Pagination : page précédente
  decrementPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadArtists();
    }
  }

  // Pagination : page suivante
  incrementPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadArtists();
    }
  }

  // Éditer un artiste (ouvre les détails dans une modal ou une autre vue)
  editArtist(artist: any): void {
    console.log('Édition de l\'artiste :', artist);
  }

  // Mettre à jour un artiste
  updateArtist(): void {
    if (this.selectedArtist) {
      this.artistService.updateArtist(this.selectedArtist.id, this.selectedArtist).subscribe(
        (response) => {
          console.log('Artiste mis à jour avec succès', response);
          this.loadArtists(); // Recharge la liste des artistes
          this.selectedArtist = null; // Ferme la vue des détails
        },
        (error) => {
          console.error('Erreur lors de la mise à jour de l\'artiste', error);
        }
      );
    }
  }

  // Naviguer vers la page d'ajout d'un nouvel artiste
  navigateToAddArtist(): void {
    this.router.navigate(['/create-artist']); // Redirige vers la page d'ajout
  }

  // Fermer la modal de détails
  closeModal(): void {
    this.selectedArtist = null;
  }

  // Afficher les détails d'un artiste
  detailsArtist(artistId: string): void {
    this.artistService.getArtistById(artistId).subscribe(
      (artist) => {
        this.selectedArtist = artist; // Ouvre la modal avec les détails de l'artiste
      },
      (error) => {
        console.error('Erreur lors de la récupération des détails de l\'artiste', error);
      }
    );
  }
  navigateToDetail(artistId: string): void {
    this.router.navigate([`/artist/${artistId}`]);
  }
  deleteArtist(artistId: string): void {
    this.artistService.deleteArtistById(artistId).subscribe(() => {
      this.loadArtists(); // Méthode pour recharger la liste des artistes après suppression
    });
  }
  
}
