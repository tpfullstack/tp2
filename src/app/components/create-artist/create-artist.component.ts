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

  showPopin: boolean = false;
  popinMessage: string = '';

  constructor(
    private artistService: ArtistService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /**
   * Affiche un message dans une pop-in.
   * @param message Le message à afficher.
   */
  showMessage(message: string): void {
    this.popinMessage = message;
    this.showPopin = true;
  }

  /**
   * Ferme la pop-in.
   */
  closePopin(): void {
    this.showPopin = false;
  }

  /**
   * Création d'un artiste avec affichage d'une pop-in en cas de succès ou d'erreur.
   */
  createArtist(): void {
    if (this.artist.label) {
      this.artistService.createArtist(this.artist).subscribe(
        () => {
          // Stocker un message global avant la redirection
          this.artistService.setGlobalMessage('Artiste créé avec succès.');
          this.router.navigate(['/artists']); // Rediriger vers la liste des artistes
        },
        (error) => {
          this.showMessage('Erreur lors de la création de l’artiste.');
        }
      );
    } else {
      this.showMessage('Le nom de l’artiste est obligatoire.');
    }
  }

  /**
   * Retourne à la liste des artistes.
   */
  navigateToArtists(): void {
    this.router.navigate(['/artists']);
  }
}
