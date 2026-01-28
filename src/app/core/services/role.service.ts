import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environment/environment';
import {Observable} from 'rxjs';
import {RoleRespose} from '../models/role.respose';

@Injectable({
  providedIn:"root"
})
export class RoleService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/roles`;

  getById(id:string): Observable<RoleRespose> {
    return this.http.get<RoleRespose>(`${this.apiUrl}/${id}`);
  }
  getByName(name:string): Observable<RoleRespose> {
    return this.http.get<RoleRespose>(`${this.apiUrl}/name/${name}`);
  }
}
