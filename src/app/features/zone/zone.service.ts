import {environment} from '../../../environment/environment';
import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ZoneRequest} from './models/zone.request';
import {ZoneResp} from './models/zone.response';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {

  private readonly http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/zones`;

  create(dto: ZoneRequest): Observable<ZoneResp> {
    return this.http.post<ZoneResp>(this.apiUrl, dto);
  }

  update(id: string, dto: ZoneRequest): Observable<ZoneResp> {
    return this.http.put<ZoneResp>(`${this.apiUrl}/${id}`, dto);
  }

  getById(id: string): Observable<ZoneResp> {
    return this.http.get<ZoneResp>(`${this.apiUrl}/${id}`);
  }

  getAll(): Observable<ZoneResp[]> {
    return this.http.get<ZoneResp[]>(this.apiUrl);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
