import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes'; // Assurez-vous que ce fichier existe et contient les bonnes routes
import { HttpClientModule } from '@angular/common/http'; // Import de HttpClientModule
import { provideHttpClient } from '@angular/common/http'; // Import de provideHttpClient

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),  // Pour le changement de zone
    provideRouter(routes),  // Fournir le routage basé sur le fichier app.routes.ts
    HttpClientModule, // Ajout du HttpClientModule pour permettre les requêtes HTTP
    provideHttpClient() // Fournir HttpClient à l'application
  ]
};
