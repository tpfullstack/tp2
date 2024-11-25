import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ArtistService {
  private apiUrl = 'http://localhost:8080/artists';

  constructor(private http: HttpClient) { }

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

  getArtistById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      tap((data) => {
        console.log(`Données de l'artiste ${id} :`, data);
      })
    );
  }

  createArtist(artist: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, artist).pipe(
      tap((data) => {
        console.log('Artiste créé :', data);
      })
    );
  }

  updateArtist(id: string, artist: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, artist).pipe(
      tap((data) => {
        console.log(`Artiste ${id} mis à jour :`, data);
      })
    );
  }

  deleteArtistById(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        console.log(`Artiste ${id} supprimé`);
      })
    );
  }

  getEventsForArtist(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/events`).pipe(
      tap((data) => {
        console.log(`Événements de l'artiste ${id} :`, data);
      })
    );
  }
}
