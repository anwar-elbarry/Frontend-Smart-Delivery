import {Component, inject, OnInit, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LivreurResp } from '../../models/livreur.reponse';
import {LivreurService} from '../../service/livreur.service';
import {LivreurCreate} from '../livreur-create/livreur-create';
import { Provider } from '../../../../core/models/auth/provider.enum';

@Component({
  selector: 'app-livreur-list',
  imports: [CommonModule, FormsModule, LivreurCreate],
  standalone: true,
  templateUrl: './livreur-list.html',
  styleUrl: './livreur-list.css',
})
export class LivreurList implements OnInit {

  private LivreurService = inject(LivreurService);
  livreursList: LivreurResp[] = [];


  // Modal properties
  showViewModal = false;
  showEditModal = false;
  showCreateModal = false;
  showAssignColisModal = false;
  selectedLivreur = signal<LivreurResp | null>(null);

  // Filter properties
  searchTerm = '';
  filterZone = '';
  filterVehicule = '';

  // All livreurs (unfiltered)
  private allLivreursList: LivreurResp[] = [];

  // Assign colis properties
  availableColis: any[] = [];
  selectedColisId = '';

  // Computed stats
  get totalLivreurs(): number {
    return this.allLivreursList.length;
  }

  get livreursActifs(): number {
    return this.allLivreursList.filter(l => l.user.enable).length;
  }

  get livreursInactifs(): number {
    return this.allLivreursList.filter(l => !l.user.enable).length;
  }

  get livreursAvecColis(): number {
    // For now, return a mock number
    return 5;
  }


  ngOnInit() {
    this.loadAllLivreurs();
  }

  loadAllLivreurs(){
    this.LivreurService.getAll().subscribe({
      next: resp => {
        this.allLivreursList = resp;
        this.applyFilters();
      },
      error: err => {
        console.log('error while feching livreurList',err);
      }
    })
  }


  // Filter methods
  applyFilters() {
    let filtered = [...this.allLivreursList];

    // Apply search term
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(livreur =>
        livreur.user.nom?.toLowerCase().includes(search) ||
        livreur.user.prenom?.toLowerCase().includes(search) ||
        livreur.user.email?.toLowerCase().includes(search) ||
        livreur.user.telephone?.includes(search) ||
        livreur.vehicule?.toLowerCase().includes(search)
      );
    }

    // Apply zone filter
    if (this.filterZone) {
      filtered = filtered.filter(livreur =>
        livreur.zoneAssignee?.nome?.includes(this.filterZone)
      );
    }

    // Apply vehicule filter
    if (this.filterVehicule) {
      filtered = filtered.filter(livreur =>
        livreur.vehicule === this.filterVehicule
      );
    }

    this.livreursList = filtered;
  }

  clearFilters() {
    this.searchTerm = '';
    this.filterZone = '';
    this.filterVehicule = '';
    this.applyFilters();
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

  handleCreate(newLivreur: LivreurResp) {
    // Ajouter le nouveau livreur à la liste
    this.allLivreursList.push(newLivreur);
    this.applyFilters();
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
      this.LivreurService.deleteLivreur(livreur.id).subscribe({
        next: () => {
          this.allLivreursList = this.allLivreursList.filter(l => l.id !== livreur.id);
          this.applyFilters();
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

  handleUpdate(updatedLivreur: LivreurResp) {
    // Mettre à jour le livreur dans la liste
    const index = this.allLivreursList.findIndex(l => l.id === updatedLivreur.id);
    if (index !== -1) {
      this.allLivreursList[index] = updatedLivreur;
    }
    this.applyFilters();
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

    this.LivreurService.updateLivreur(livreur.id, request).subscribe({
      next: (resp) => {
        livreur.user.enable = resp.user.enable;
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
    this.loadAllLivreurs();
  }

  // Exporter la liste en CSV
  exportToCSV() {
    const headers = ['Nom', 'Prénom', 'Email', 'Téléphone', 'Véhicule', 'Zone', 'Statut'];
    const csvData = this.livreursList.map(l => [
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
