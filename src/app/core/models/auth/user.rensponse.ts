import { Provider } from "./provider.enum";
import {RoleRespose} from '../role.respose';

export interface User{
     id: string;
     nom: string;
     prenom: string;
     username: string;
     email: string;
     telephone: string;
     adress: string;
     role: RoleRespose;
     provider: Provider;
     providerId: string;
     enable: boolean;
  }
