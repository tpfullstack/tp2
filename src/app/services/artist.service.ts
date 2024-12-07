import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArtistService {
  private apiUrl = 'http://localhost:8080/artists';

  constructor(private http: HttpClient) { }

  getArtists(filterParams: any, pageable: any): Observable<any> {
    let params = new HttpParams()
      .set('page', pageable.page.toString())
      .set('size', pageable.size.toString());

    if (pageable.sort) {
      pageable.sort.forEach((s: string) => (params = params.append('sort', s)));
    }

    if (filterParams.label) {
      params = params.set('label', filterParams.label);
    }

    return this.http.get<any>(this.apiUrl, { params });
  }

  getAllArtists(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  getArtistById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createArtist(artist: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, artist);
  }

  updateArtist(id: string, artist: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, artist);
  }

  deleteArtistById(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getEventsForArtist(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/events`);
  }

  private globalMessage: string = '';

  setGlobalMessage(message: string): void {
    this.globalMessage = message;
  }

  getGlobalMessage(): string {
    const message = this.globalMessage;
    this.globalMessage = ''; 
    return message;
  }
}