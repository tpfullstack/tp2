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

    return this.http.get<any>(this.apiUrl, { params }).pipe();
  }

  getArtistById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe();
  }

  createArtist(artist: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, artist).pipe(
    );
  }

  updateArtist(id: string, artist: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, artist).pipe();
  }

  deleteArtistById(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe();
  }

  getEventsForArtist(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/events`).pipe();
  }
  private globalMessage: string = '';

setGlobalMessage(message: string): void {
  this.globalMessage = message;
}

getGlobalMessage(): string {
  const message = this.globalMessage;
  this.globalMessage = ''; // Réinitialiser après récupération
  return message;
}

}
