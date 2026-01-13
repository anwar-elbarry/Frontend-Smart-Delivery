import {UserRole} from '../enums/user-role.enum';
import {Provider} from './provider.enum';

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
