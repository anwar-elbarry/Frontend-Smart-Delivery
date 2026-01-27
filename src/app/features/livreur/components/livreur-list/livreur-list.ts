import {Component, computed, inject, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LivreurResp } from '../../models/livreur.reponse';
import {LivreurService} from '../../service/livreur.service';
import {LivreurCreate} from '../livreur-create/livreur-create';
import { Provider } from '../../../../core/models/auth/provider.enum';
import {ZoneService} from '../../../zone/zone.service';
import { ColisService } from '../../../colis/services/colis.service';
import { ZoneResp } from '../../../zone/models/zone.response';

@Component({
  selector: 'app-livreur-list',
  imports: [CommonModule, FormsModule, LivreurCreate],
  standalone: true,
  templateUrl: './livreur-list.html',
  styleUrl: './livreur-list.css',
})
export class LivreurList {

  private livreurService = inject(LivreurService);
  private zoneService = inject(ZoneService);
  private colisService = inject(ColisService);

  // Signals pour les données
  private allLivreursData = signal<LivreurResp[]>([]);
  allZonesList = signal<ZoneResp[]>([]);
  availableColis = signal<any[]>([]);

  // États de chargement
  isLoading = signal(true);
  hasError = signal(false);

  // Modal properties
  showViewModal = false;
  showEditModal = false;
  showCreateModal = false;
  showAssignColisModal = false;
  selectedLivreur = signal<LivreurResp | null>(null);

  // Filter properties
  searchTerm = signal('');
  filterZone = signal('');
  filterVehicule = signal('');


  // Liste filtrée de livreurs basée sur les ressources et filtres
  livreursList = computed(() => {
    const livreurs = this.allLivreursData();
    let filtered = [...livreurs];

    // Apply search term
    const search = this.searchTerm().toLowerCase().trim();
    if (search) {
      filtered = filtered.filter(livreur =>
        livreur.user.nom?.toLowerCase().includes(search) ||
        livreur.user.prenom?.toLowerCase().includes(search) ||
        livreur.user.email?.toLowerCase().includes(search) ||
        livreur.user.telephone?.includes(search) ||
        livreur.vehicule?.toLowerCase().includes(search)
      );
    }

    // Apply zone filter
    const zone = this.filterZone();
    if (zone) {
      filtered = filtered.filter(livreur =>
        livreur.zoneAssignee?.nome?.includes(zone)
      );
    }

    // Apply vehicule filter
    const vehicule = this.filterVehicule();
    if (vehicule) {
      filtered = filtered.filter(livreur =>
        livreur.vehicule === vehicule
      );
    }

    return filtered;
  });

  // Computed stats basés sur toutes les données
  totalLivreurs = computed(() => {
    return this.allLivreursData().length;
  });

  livreursActifs = computed(() => {
    return this.allLivreursData().filter(l => l.user.enable).length;
  });

  livreursInactifs = computed(() => {
    return this.allLivreursData().filter(l => !l.user.enable).length;
  });

  livreursAvecColis = computed(() => {
    // TODO: Implémenter le comptage réel basé sur les colis assignés
    return 5;
  });

  selectedColisId = '';

  constructor() {
    // Charger les données au démarrage
    this.loadAllData();
  }

  // Charger toutes les données
  private loadAllData() {
    this.isLoading.set(true);
    this.hasError.set(false);

    // Compteur pour suivre les requêtes terminées
    let completed = 0;
    const total = 3;
    let hasErrors = false;

    const checkComplete = () => {
      completed++;
      if (completed === total) {
        this.isLoading.set(false);
        this.hasError.set(hasErrors);
      }
    };

    // Charger les livreurs
    this.livreurService.getAll().subscribe({
      next: (data) => {
        this.allLivreursData.set(data);
        checkComplete();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des livreurs:', err);
        hasErrors = true;
        checkComplete();
      }
    });

    // Charger les zones
    this.zoneService.getAll().subscribe({
      next: (data) => {
        this.allZonesList.set(data);
        checkComplete();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des zones:', err);
        hasErrors = true;
        checkComplete();
      }
    });

    // Charger les colis
    this.colisService.getAllColis(0, 1000).subscribe({
      next: (data) => {
        const availableColisList = data.content?.filter((c: any) => !c.livreurId) ?? [];
        this.availableColis.set(availableColisList);
        checkComplete();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des colis:', err);
        hasErrors = true;
        checkComplete();
      }
    });
  }

  clearFilters() {
    this.searchTerm.set('');
    this.filterZone.set('');
    this.filterVehicule.set('');
  }

  // Action methods
  openCreateModal() {
    // Créer un livreur vide pour le formulaire de création
    this.selectedLivreur.set({
      id: '',
      user: {
        id: '',
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        adress: '',
        username: '',
        roleName: 'LIVREUR',
        provider: Provider.LOCAL,
        enable: true
      },
      vehicule: '',
      zoneAssignee: {
        id: '',
        nome: '',
        codePostal: 0
      }
    });
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.selectedLivreur.set(null);
  }

  handleCreate(_newLivreur: LivreurResp) {
    // Recharger les données pour obtenir la liste à jour du serveur
    this.loadAllData();
  }

  viewLivreur(livreur: LivreurResp) {
    this.selectedLivreur.set(livreur);
    this.showViewModal = true;
  }

  editLivreur(livreur: LivreurResp) {
    this.selectedLivreur.set({...livreur});
    this.showEditModal = true;
  }

  deleteLivreur(livreur: LivreurResp) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le livreur ${livreur.user.nom} ${livreur.user.prenom} ?`)) {
      this.livreurService.deleteLivreur(livreur.id).subscribe({
        next: () => {
          // Recharger les données pour obtenir la liste à jour
          this.loadAllData();
          console.log('Livreur supprimé avec succès');
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          alert('Erreur lors de la suppression du livreur');
        }
      });
    }
  }

  assignColis(livreur: LivreurResp) {
    this.selectedLivreur.set(livreur);
    this.selectedColisId = '';
    this.showAssignColisModal = true;
  }

  closeViewModal() {
    this.showViewModal = false;
    this.selectedLivreur.set(null);
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedLivreur.set(null);
  }

  handleUpdate(_updatedLivreur: LivreurResp) {
    this.loadAllData();
  }

  closeAssignColisModal() {
    this.showAssignColisModal = false;
    this.selectedLivreur.set(null);
    this.selectedColisId = '';
  }

  submitAssignColis() {
    const livreur = this.selectedLivreur();
    if (livreur && this.selectedColisId) {
      console.log(`Assigning colis ${this.selectedColisId} to livreur ${livreur.user.nom}`);
      // In real app, call API here
      this.closeAssignColisModal();
    }
  }

  // Toggle le statut actif/inactif d'un livreur
  toggleLivreurStatus(livreur: LivreurResp) {
    const request = {
      userId: livreur.user.id,
      vehicule: livreur.vehicule,
      zoneAssigneeId: livreur.zoneAssignee?.id
    };

    this.livreurService.updateLivreur(livreur.id, request).subscribe({
      next: () => {
        // Recharger les données pour obtenir la liste à jour
        this.loadAllData();
        console.log('Statut du livreur mis à jour');
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du statut:', err);
        alert('Erreur lors de la mise à jour du statut');
      }
    });
  }

  // Rafraîchir la liste des livreurs
  refreshList() {
    this.loadAllData();
  }

  // Exporter la liste en CSV
  exportToCSV() {
    const headers = ['Nom', 'Prénom', 'Email', 'Téléphone', 'Véhicule', 'Zone', 'Statut'];
    const csvData = this.livreursList().map(l => [
      l.user.nom,
      l.user.prenom,
      l.user.email,
      l.user.telephone,
      l.vehicule,
      l.zoneAssignee?.nome || 'N/A',
      l.user.enable ? 'Actif' : 'Inactif'
    ]);

    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `livreurs_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
