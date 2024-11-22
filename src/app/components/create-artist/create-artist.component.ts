import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ArtistService } from '../../services/artist.service';

@Component({
  selector: 'app-create-artist',
  templateUrl: './create-artist.component.html',
  styleUrls: ['./create-artist.component.css'],
  standalone: true, // Indique que ce composant est autonome
  imports: [FormsModule], // Assure-toi d'importer FormsModule pour ngModel
})
export class CreateArtistComponent {
  artist = {
    label: '',
  };

  constructor(public router: Router, private artistService: ArtistService) {}

  // Fonction de création de l'artiste
  createArtist(): void {
    if (this.artist.label) {
      this.artistService.createArtist(this.artist).subscribe(
        (response) => {
          console.log('Artiste créé', response);
          this.router.navigate(['/artists']); // Redirection vers la liste des artistes
        },
        (error) => {
          console.error('Erreur lors de la création de l\'artiste', error);
        }
      );
    } else {
      console.error('Le nom et la description de l\'artiste sont requis');
    }
  }

  // Fonction de fermeture de la modal
  closeModal(): void {
    this.router.navigate(['/artists']);
  }
}
