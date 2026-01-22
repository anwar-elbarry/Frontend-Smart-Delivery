import {environment} from '../../../../environment/environment';
import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LivreurRequest} from '../models/livreur.request';
import {Observable} from 'rxjs';

@Injectable({providedIn:'root'})
export class LivreurService {

  private readonly apiUrl = `${environment.apiUrl}/Livreurs`;
  private http = inject(HttpClient);

  createLivreur(req:LivreurRequest):Observable<any>{
    return   this.http.post(`${this.apiUrl}`,req);
  }

  updateLivreur(id:string,req:LivreurRequest):Observable<any>{
    return   this.http.put(`${this.apiUrl}/${id}`,req);
  }

  getAll():Observable<any>{
    return  this.http.get(`${this.apiUrl}`);
  }

  deleteLivreur(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getLivreurById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
