import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserModel} from '../models/user.model';
import {tap} from 'rxjs';
@Injectable({
  providedIn: "root"
})
export class Auth {
  private http = inject(HttpClient);
  private apiUrl = "http://localhost:4200/api/auth";

  currentUser = signal<UserModel | null>(null);

  constructor() {
    const savedUser = localStorage.getItem('user');
    if (savedUser){
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  login(credentials: any){
      return this.http.post<UserModel>(`${this.apiUrl}/login`,credentials).pipe(
       tap((user) => {
              this.currentUser.set(user);
              localStorage.setItem('user',JSON.stringify(user))
       })
      )
  }

  logout(){
    this.currentUser.set(null);
    localStorage.removeItem('user');
  }

  isAuthenticated(){
    return  this.currentUser() !== null;
  }
}
