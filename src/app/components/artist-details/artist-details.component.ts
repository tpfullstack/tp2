import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtistService } from '../../services/artist.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-artist-details',
  templateUrl: './artist-details.component.html',
  styleUrls: ['./artist-details.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class ArtistDetailComponent implements OnInit {
  artist: any;
  popinMessage: string | null = null;

  constructor(
    private artistService: ArtistService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const artistId = this.route.snapshot.paramMap.get('id');
    if (artistId) {
      this.artistService.getArtistById(artistId).subscribe((data) => {
        this.artist = data;
      });
    }
  }

  showMessage(message: string): void {
    this.popinMessage = message;
  }

  closePopin(): void {
    this.popinMessage = null;
  }

  updateArtist(): void {
    if (this.artist) {
      this.artistService.updateArtist(this.artist.id, this.artist).subscribe(
        () => {
          this.artistService.setGlobalMessage('Artiste mis à jour avec succès.');
          this.router.navigate(['/artists']);
        },
        (error) => {
          this.showMessage('Erreur lors de la mise à jour de l\'artiste.');
        }
      );
    }
  }

  closeModal() {
    this.artistService.setGlobalMessage('Modification annulée.');
    this.router.navigate(['/artists']);
  }
}