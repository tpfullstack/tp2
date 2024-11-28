import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-modal',
  standalone: true, // Assurez-vous que c'est bien ici
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.css']
})
export class ErrorModalComponent {
  errorMessage: string = "404 - Page Not Found. ";

  constructor(private router: Router) {}

  redirectToHome() {
    this.router.navigate(['/']); // Redirige vers la page d'accueil
  }
}