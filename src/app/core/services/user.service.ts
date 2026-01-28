import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { User } from '../models/auth/user.rensponse';
import {UserUpdateRequest} from '../models/auth/user.update.request';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  update(id: string,user:UserUpdateRequest): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`,user);
  }
}
