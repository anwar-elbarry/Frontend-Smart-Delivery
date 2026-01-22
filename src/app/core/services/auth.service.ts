import {computed, inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs';
import {CurrentUser} from '../models/auth/current-user.model';
import {AuthResponse, LoginCredentials} from '../models/auth/auth.model';
import {UserRole} from '../models/enums/user-role.enum';
import { environment } from '../../../environment/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  private accessToken = '';
  private refreshToken = '';

  private currentUser = signal<CurrentUser | null>(null);
  isAuthenticated = computed(() => !!this.currentUser());

  constructor() {
    const savedUser = localStorage.getItem('user');
    const savedAccess = localStorage.getItem('accessToken');
    const savedRefresh = localStorage.getItem('refreshToken');

    if (savedUser && savedAccess && savedRefresh){
      this.currentUser.set(JSON.parse(savedUser));
      this.accessToken = savedAccess;
      this.refreshToken = savedRefresh;
    }
  }

  login(credentials: LoginCredentials){
      return this.http.post<AuthResponse>(`${this.apiUrl}/login`,credentials).pipe(
       tap((resp) => {
         const user: CurrentUser = {
           ...resp.user,
           role: resp.user.roleName as UserRole,
           enabled: resp.user.enable,
           isAuthenticated: true
         };
              this.currentUser.set(user);
              this.accessToken = resp.accessToken;
              this.refreshToken = resp.refreshToken;

              // persist everything
              localStorage.setItem('user',JSON.stringify(user));
              localStorage.setItem('accessToken', resp.accessToken);
              localStorage.setItem('refreshToken', resp.refreshToken);
       })
      )
  }


  refresh(){
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`,{},{
      headers: {
        'Authorization': `Bearer ${this.refreshToken}`
      }
    }).pipe(
      tap((resp) => {
        this.accessToken = resp.accessToken;
        this.refreshToken = resp.refreshToken;

         localStorage.setItem('accessToken', resp.accessToken);
         localStorage.setItem('refreshToken', resp.refreshToken);
      })
    );
  }

  getAccessToken(){
    console.log('token: '+this.accessToken);
    return this.accessToken;
  }

  getRefreshToken(){
    return this.refreshToken;
  }

  getCurrentUser(){
    return this.currentUser();
  }

  logout(){
    this.currentUser.set(null);
    this.accessToken = '';
    this.refreshToken = '';
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessToken');
  }
}
