import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private router: Router) { }

  navigateToAddEvent(): void {
    this.router.navigate(['/create-event']);
  }
  navigateToArtistes(): void {
    this.router.navigate(['/artists']);
  }

  navigateToEvenements(): void {
    this.router.navigate(['/events']);
  }
}
