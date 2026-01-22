import {Component, inject, input, output, signal, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {LivreurResp} from '../../models/livreur.reponse';
import {LivreurService} from '../../service/livreur.service';
import {LivreurRequest} from '../../models/livreur.request';
import {CommonModule} from '@angular/common';
import {UserService} from '../../../../core/services/user.service';
import {ZoneService} from '../../../zone/zone.service';
import {User} from '../../../../core/models/auth/user.rensponse';
import {ZoneResp} from '../../../zone/models/zone.response';

@Component({
  selector: 'app-livreur-create',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './livreur-create.html',
  styleUrl: './livreur-create.css',
})
export class LivreurCreate implements OnInit {

  private livreurService = inject(LivreurService);
  private userService = inject(UserService);
  private zoneService = inject(ZoneService);

  // Input signal avec le livreur sélectionné (optionnel pour la création)
  selectedLivreur = input.required<LivreurResp>();
  isEditMode = input<boolean>(true);

  // Output signals pour communiquer avec le parent
  onCreate = output<LivreurResp>();
  onUpdate = output<LivreurResp>();
  onClose = output<void>();

  // Signals pour l'état du composant
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  // Listes pour les dropdowns
  availableUsers = signal<User[]>([]);
  availableZones = signal<ZoneResp[]>([]);

  // Données du formulaire
  formData: LivreurRequest = {
    userId: '',
    vehicule: '',
    zoneAssigneeId: ''
  };

  ngOnInit() {
    // Charger les utilisateurs et les zones
    this.loadUsers();
    this.loadZones();

    // Initialiser le formulaire avec les données du livreur sélectionné
    const livreur = this.selectedLivreur();
    if (livreur) {
      this.formData = {
        userId: livreur.user.id || '',
        vehicule: livreur.vehicule || '',
        zoneAssigneeId: livreur.zoneAssignee?.id || ''
      };
    }
  }

  loadUsers() {
    this.userService.getAll().subscribe({
      next: (users) => {
        // Filtrer uniquement les utilisateurs avec le rôle CLIENT
        const clientUsers = users.filter(user =>
          user.roleName?.toLowerCase() === 'client' ||
          user.roleName === 'CLIENT'
        );
        this.availableUsers.set(clientUsers);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs:', err);
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

  submitForm() {
    if (this.isEditMode()) {
      this.updateLivreur();
    } else {
      this.createLivreur();
    }
  }

  createLivreur() {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.livreurService.createLivreur(this.formData).subscribe({
      next: (resp) => {
        this.isLoading.set(false);
        this.successMessage.set('Livreur créé avec succès!');
        this.onCreate.emit(resp);
        this.onClose.emit();
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set('Erreur lors de la création du livreur');
        console.error('Erreur:', err);
      }
    });
  }

  updateLivreur() {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const livreur = this.selectedLivreur();

    this.livreurService.updateLivreur(livreur.id, this.formData).subscribe({
      next: (resp) => {
        this.isLoading.set(false);
        this.successMessage.set('Livreur mis à jour avec succès!');
        this.onUpdate.emit(resp);
        this.onClose.emit();
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set('Erreur lors de la mise à jour du livreur');
        console.error('Erreur:', err);
      }
    });
  }

  onCancel() {
    this.onClose.emit();
  }

}
