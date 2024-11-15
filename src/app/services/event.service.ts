import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = 'http://localhost:8080/events';  // L'URL de ton API

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer les événements avec la pagination
  getEvents(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    // Log des paramètres envoyés avec la requête
    console.log('Appel API avec paramètres :', params.toString());

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      // Log des données reçues de l'API
      tap((data) => {
        console.log('Données reçues de l\'API :', data);
      })
    );
  }
  getEventById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  deleteEventById(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
  updateEvent(id: string, event: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, event);
  }
  createEvent(event: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, event);
  }
  
}
