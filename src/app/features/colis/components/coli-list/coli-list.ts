import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ColiCreate } from '../coli-create/coli-create';
import { ColiModel } from '../../models/coli-model';
import { ColisService } from '../../services/colis.service';
import { Priority } from '../../models/enums/priority.enum';
import { ColisStatus } from '../../models/enums/colis-status.enum';

@Component({
  selector: 'app-coli-list',
  imports: [CommonModule, ColiCreate, FormsModule],
  standalone: true,
  templateUrl: './coli-list.html',
  styleUrl: './coli-list.css',
})
export class ColiList implements OnInit {
  private colisService = inject(ColisService);
  colisList: ColiModel[] = [];
  paginatedColis: ColiModel[] = [];

  // Pagination properties
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  showCreateModal = false;
  showViewModal = false;
  showEditModal = false;
  selectedColi: ColiModel | null = null;

  // Filter properties
  searchTerm = '';
  filterStatut = '';
  filterPriorite = '';
  filterZone = '';

  // All colis (unfiltered)
  private allColisList: ColiModel[] = [];

  // Computed stats from all colis (unfiltered)
  get totalColis(): number {
    return this.allColisList.length;
  }

  get colisEnTransit(): number {
    return this.allColisList.filter(c => c.statut === ColisStatus.IN_TRANSIT).length;
  }

  get colisLivres(): number {
    return this.allColisList.filter(c => c.statut === ColisStatus.DELIVERED).length;
  }

  get colisEnRetard(): number {
    return this.allColisList.filter(c =>
      c.statut === ColisStatus.CREATED ||
      c.statut === ColisStatus.COLLECTED
    ).length;
  }

  ngOnInit() {
    this.getColis(); // Load data from API
  }

  openCreateModal() {
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.getColis(); // Refresh data from API
  }


  getColis() {
    this.colisService.getAllColis(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        console.log(response);
        this.allColisList = response.content.map((item) => ({
          id: item.id,
          poids: item.poids,
          priorite: item.priorite as Priority,
          statut: item.statut as ColisStatus,
          description: item.description,
          villeDestination: item.villeDestination,
          zone: item.zone?.nome || 'N/A',
          livreur: item.livreur?.userId || 'Non assigné',
          clientExpediteur: item.clientExpediteur?.nom || 'N/A',
          destinataire: item.destinataire?.nom || 'N/A',
        } as ColiModel));

        this.currentPage = response.number;
        this.pageSize = response.size;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;

        // Apply filters to the loaded data
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error fetching colis:', error);
      }
    });
  }

  // Pagination methods
  goToPage(page: number) {
    this.currentPage = page;
    this.updatePaginatedColis();
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.updatePaginatedColis();
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePaginatedColis();
    }
  }

  // Filter methods
  applyFilters() {
    let filtered = [...this.allColisList];

    // Apply search term
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(coli =>
        coli.id?.toLowerCase().includes(search) ||
        coli.description?.toLowerCase().includes(search) ||
        coli.clientExpediteur?.toLowerCase().includes(search) ||
        coli.destinataire?.toLowerCase().includes(search) ||
        coli.villeDestination?.toLowerCase().includes(search)
      );
    }

    // Apply status filter
    if (this.filterStatut) {
      filtered = filtered.filter(coli => coli.statut === this.filterStatut);
    }

    // Apply priority filter
    if (this.filterPriorite) {
      filtered = filtered.filter(coli => coli.priorite === this.filterPriorite);
    }

    // Apply zone filter
    if (this.filterZone) {
      filtered = filtered.filter(coli => coli.zone?.includes(this.filterZone));
    }

    this.colisList = filtered;
    this.totalElements = filtered.length;
    this.totalPages = Math.ceil(this.totalElements / this.pageSize);
    this.currentPage = 0;
    this.updatePaginatedColis();
  }

  updatePaginatedColis() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedColis = this.colisList.slice(startIndex, endIndex);
  }

  clearFilters() {
    this.searchTerm = '';
    this.filterStatut = '';
    this.filterPriorite = '';
    this.filterZone = '';
    this.applyFilters();
  }

  // Action methods
  viewColi(coli: ColiModel) {
    this.selectedColi = coli;
    this.showViewModal = true;
    console.log('Viewing coli:', coli);
  }

  editColi(coli: ColiModel) {
    this.selectedColi = coli;
    this.showEditModal = true;
    console.log('Editing coli:', coli);
  }

  deleteColi(coli: ColiModel) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le colis ${coli.id} ?`)) {
      this.colisService.deleteColis(coli.id!).subscribe({
        next: () => {
          this.getColis();
          console.log('Coli deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting coli:', error);
        }
      });
    }
  }

  closeViewModal() {
    this.showViewModal = false;
    this.selectedColi = null;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedColi = null;
    this.getColis();
  }

  updateColi() {
    if (this.selectedColi) {
      console.log('Updating coli:', this.selectedColi);

      const colisRequest = {
        poids: this.selectedColi.poids!,
        villeDestination: this.selectedColi.villeDestination!,
        zoneId: this.selectedColi.zone || null,
        clientExpediteurId: this.selectedColi.clientExpediteur!,
        destinataireId: this.selectedColi.destinataire || null
      };

      this.colisService.updateColis(this.selectedColi.id!, colisRequest).subscribe({
        next: () => {
          this.getColis();
          this.closeEditModal();
          console.log('Coli updated successfully');
        },
        error: (error) => {
          console.error('Error updating coli:', error);
        }
      });
    }
  }


}
