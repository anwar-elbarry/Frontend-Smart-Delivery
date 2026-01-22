import { CommonModule } from '@angular/common';
import { Component, inject, output, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ColisService } from '../../services/colis.service';
import { ColisRequest } from '../../models/coli.request.model';
import { UserService } from '../../../../core/services/user.service';
import { ZoneService } from '../../../zone/zone.service';
import { User } from '../../../../core/models/auth/user.rensponse';
import { ZoneResp } from '../../../zone/models/zone.response';
import { Priority } from '../../models/enums/priority.enum';

@Component({
  selector: 'app-coli-create',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './coli-create.html',
  styleUrl: './coli-create.css',
})
export class ColiCreate implements OnInit {
  private colisService = inject(ColisService);
  private userService = inject(UserService);
  private zoneService = inject(ZoneService);

  onCancel = output<void>();
  onCreate = output<void>();

  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  availableExpediteurs = signal<User[]>([]);
  availableDestinataires = signal<User[]>([]);
  availableZones = signal<ZoneResp[]>([]);

  // Liste des priorités
  priorities = [
    { value: Priority.HIGHT, label: 'Haute' },
    { value: Priority.MEDIUM, label: 'Moyenne' },
    { value: Priority.LOW, label: 'Basse' }
  ];

  formData: ColisRequest = {
    poids: 0,
    villeDestination: '',
    zoneId: null,
    clientExpediteurId: '',
    destinataireId: null,
    priorite: Priority.MEDIUM
  };

  ngOnInit() {
    this.loadDestinataires();
    this.loadExpediteurs();
    this.loadZones();
  }
  loadExpediteurs() {
    this.userService.getAll().subscribe({
      next: (users) => {
        const clients = users.filter(user =>
          user.roleName === 'EXPEDITEUR'
        );
        this.availableExpediteurs.set(clients);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des clients:', err);
      }
    });
  }

  loadDestinataires() {
    this.userService.getAll().subscribe({
      next: (users) => {
        const clients = users.filter(user =>
          user.roleName === 'DESTINATAIRE'
        );
        this.availableDestinataires.set(clients);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des clients:', err);
      }
    });
  }


  loadZones() {
    this.zoneService.getAll().subscribe({
      next: (zones) => {
        this.availableZones.set(zones);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des zones:', err);
      }
    });
  }

  cancel() {
    this.onCancel.emit();
  }

  submit() {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.colisService.createColis(this.formData).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Colis créé avec succès!');
        this.onCreate.emit();
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set('Erreur lors de la création du colis');
        console.error('Erreur:', err);
      }
    });
  }
}
