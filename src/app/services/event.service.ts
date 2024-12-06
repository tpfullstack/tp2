import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    return this.http.get<any>(this.apiUrl, { params });
  }

  getEventById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  deleteEventById(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  updateEvent(id: string, event: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put<any>(`${this.apiUrl}/${id}`, event, { headers });
  }

  createEvent(event: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, event);
  }

  linkArtistToEvent(eventId: string, artistId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${eventId}/artists/${artistId}`, {});
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
    this.globalMessage = ''; 
    return message;
  }
}