import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = 'http://localhost:8080/events';

  constructor(private http: HttpClient) { }

  getEvents(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());


    return this.http.get<any>(this.apiUrl, { params }).pipe();
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
  linkArtistToEvent(eventId: string, artistId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${eventId}/artists/${artistId}`, {});
  }

  getArtists(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(this.apiUrl, { params }).pipe(
    
    );
  }
  unlinkArtistFromEvent(eventId: string, artistId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${eventId}/artists/${artistId}`);
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
