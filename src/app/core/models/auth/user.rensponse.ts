import { Provider } from "./provider.enum";

export interface User{
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