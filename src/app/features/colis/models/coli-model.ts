import {ColisStatus} from './enums/colis-status.enum';
import {Priority} from './enums/priority.enum';

export  interface ColiModel {
  id?: string;
  description?: string;
  poids?: number;
  statut?: ColisStatus;
  priorite: Priority;
  villeDestination?: string;
  zone?: string;
  livreur?: string;
  clientExpediteur?: string;
  destinataire?: string;
}
