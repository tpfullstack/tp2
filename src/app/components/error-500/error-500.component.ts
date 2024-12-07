import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-500',
  standalone: true,
  templateUrl: './error-500.component.html',
  styleUrls: ['./error-500.component.css']
})
export class Error500Component {
  errorMessage: string = "500 - Erreur serveur";

  constructor(private router: Router) {}

  redirectToHome() {
    this.router.navigate(['/']);
  }
}