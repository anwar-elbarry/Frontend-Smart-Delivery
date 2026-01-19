import {Provider} from './provider.enum';
import { User } from './user.rensponse';

export  interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
