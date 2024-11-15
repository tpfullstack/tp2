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
    description: '',
  };

  constructor(public router: Router, private artistService: ArtistService) {}

  createArtist() {
    this.artistService.createArtist(this.artist).subscribe((response) => {
      console.log('Artiste créé', response);
      this.router.navigate(['/artists']);
    });
  }
}
