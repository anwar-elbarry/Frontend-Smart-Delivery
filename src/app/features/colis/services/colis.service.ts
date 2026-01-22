import {inject, Injectable} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ColisRequest } from '../models/coli.request.model';
import { environment } from '../../../../environment/environment';
import { PageResponse } from '../../../core/models/page.response.model';

@Injectable({
  providedIn: 'root'
})
export class ColisService {
  private readonly API_URL = `${environment.apiUrl}/colis`;
  private http = inject(HttpClient);

  // Create a new colis
  createColis(colisRequest: ColisRequest): Observable<any> {
    return this.http.post(`${this.API_URL}`, colisRequest);
  }

  // Get all colis
  getAllColis(
    page: number= 0,
    size: number = 10,
    sortBy: string = 'id',
    sortDir: string = 'asc'
  ): Observable<PageResponse<any>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<PageResponse<any>>(`${this.API_URL}`,{params});
  }

  // Get colis by ID
  getColisById(id: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${id}`);
  }

  // Update colis
  updateColis(id: string, colisRequest: ColisRequest): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, colisRequest);
  }

  // Delete colis
  deleteColis(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  // Get colis by status
  getColisByStatus(status: string): Observable<any[]> {
    const params = new HttpParams().set('status', status);
    return this.http.get<any[]>(`${this.API_URL}/status`, { params });
  }

  // Get colis by zone
  getColisByZone(zoneId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/zone/${zoneId}`);
  }

  // Get colis by livreur
  getColisByLivreur(livreurId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/livreur/${livreurId}`);
  }

  // Get colis by client expediteur
  getColisByClientExpediteur(clientId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/client/${clientId}`);
  }

  // Search colis
  searchColis(searchTerm: string): Observable<any[]> {
    const params = new HttpParams().set('search', searchTerm);
    return this.http.get<any[]>(`${this.API_URL}/search`,{ params });
  }

  assignColis(coliId:string,livreurId:string){
        const params = new HttpParams()
        .set('colisId',coliId)
        .set('livreurId',livreurId);

        return this.http.put(`${this.API_URL}\assign`,null,{params});
  }
}
