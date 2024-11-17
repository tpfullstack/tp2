import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtistService } from '../../services/artist.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  // Import pour les directives *ngIf, *ngFor

@Component({
  selector: 'app-artist-details',
  templateUrl: './artist-details.component.html',
  styleUrls: ['./artist-details.component.css'],
  standalone: true, // Indique que ce composant est autonome
  imports: [FormsModule, CommonModule], 
})
export class ArtistDetailComponent implements OnInit {
  artist: any;

  constructor(
    private artistService: ArtistService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const artistId = this.route.snapshot.paramMap.get('id');
    if (artistId) {
      this.artistService.getArtistById(artistId).subscribe((data) => {
        this.artist = data;
      });
    }
  }

  updateArtist(): void {
    if (this.artist) {
      this.artistService.updateArtist(this.artist.id, this.artist).subscribe(() => {
        this.router.navigate(['/artists']);
      });
    }
  }
  navigateToArtists() {
    this.router.navigate(['/artists']);
  }
}
