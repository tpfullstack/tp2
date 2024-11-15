import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ArtistService {
  private apiUrl = 'http://localhost:8080/artists'; // L'URL de l'API

  constructor(private http: HttpClient) {}

  // Récupérer une liste paginée d'artistes
  getArtists(page: number, size: number, sort?: string[]): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (sort) {
      sort.forEach((s) => (params = params.append('sort', s)));
    }

    console.log('Appel API avec paramètres :', params.toString());

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      tap((data) => {
        console.log('Données reçues de l\'API :', data);
      })
    );
  }

  // Récupérer un artiste par ID
  getArtistById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      tap((data) => {
        console.log(`Données de l'artiste ${id} :`, data);
      })
    );
  }

  // Créer un nouvel artiste
  createArtist(artist: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, artist).pipe(
      tap((data) => {
        console.log('Artiste créé :', data);
      })
    );
  }

  // Mettre à jour un artiste existant
  updateArtist(id: string, artist: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, artist).pipe(
      tap((data) => {
        console.log(`Artiste ${id} mis à jour :`, data);
      })
    );
  }

  // Supprimer un artiste par ID
  deleteArtistById(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        console.log(`Artiste ${id} supprimé`);
      })
    );
  }

  // Récupérer les événements liés à un artiste
  getEventsForArtist(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/events`).pipe(
      tap((data) => {
        console.log(`Événements de l'artiste ${id} :`, data);
      })
    );
  }
}
