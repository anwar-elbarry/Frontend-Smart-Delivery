import {UserRole} from './enums/user-role.enum';

export  interface LoginCredentials {
  username: string
  password: string
}

export enum Provider{
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE',
  APPLE = 'APPLE',
  FACEBOOK = 'FACEBOOK',
  OKTA = 'OKTA'
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
     id: string;
     nom: string;
     prenom: string;
     username: string;
     email: string;
     telephone: string;
     adress: string;
     roleName: string;
     provider: Provider;
     enable: boolean;
  };
}

export interface CurrentUser {
  id: string;
  username: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  adress?: string;
  role: UserRole;
  provider: Provider;
  enabled: boolean;
  isAuthenticated: true;
}
