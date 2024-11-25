import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtistService } from '../../services/artist.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-artist',
  templateUrl: './create-artist.component.html',
  styleUrls: ['./create-artist.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class CreateArtistComponent {
  artist = {
    label: '',
  };

  constructor(
    private artistService: ArtistService,
    private route: ActivatedRoute,
    private router: Router
  ) { }
  createArtist(): void {
    if (this.artist.label) {
      this.artistService.createArtist(this.artist).subscribe(
        (response) => {
          console.log('Artiste créé', response);
          this.router.navigate(['/artists']);
        },
        (error) => {
          console.error('Erreur lors de la création de l\'artiste', error);
        }
      );
    } else {
      console.error('Le nom et la description de l\'artiste sont requis');
    }
  }
  navigateToArtists() {
    this.router.navigate(['/artists']);
  }
  closeModal() {
    this.router.navigate(['/artists']);
  }

}
