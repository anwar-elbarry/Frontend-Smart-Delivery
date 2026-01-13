import {Provider} from './provider.enum';

export  interface LoginCredentials {
  username: string
  password: string
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
