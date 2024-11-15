import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config'; // Assurez-vous que le chemin est correct
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
