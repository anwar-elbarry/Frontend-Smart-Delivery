import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ZoneResp } from '../../models/zone.response';
import { ZoneService } from '../../zone.service';
import { ZoneRequest } from '../../models/zone.request';

@Component({
  selector: 'app-zone-list',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './zone-list.html',
  styleUrl: './zone-list.css',
})
export class ZoneList implements OnInit {
  private zoneService = inject(ZoneService);

  zonesList: ZoneResp[] = [];
  paginatedZones: ZoneResp[] = [];

  // Pagination properties
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  // Modal properties
  showViewModal = false;
  showEditModal = false;
  showCreateModal = false;
  selectedZone: ZoneResp | null = null;

  // Filter properties
  searchTerm = '';

  // All zones (unfiltered)
  private allZonesList: ZoneResp[] = [];

  ngOnInit() {
    this.loadZones();
  }

  loadZones() {
    this.zoneService.getAll().subscribe({
      next: (zones) => {
        this.allZonesList = zones;
        console.log(zones);
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading zones:', error);
      }
    });
  }

  // Filter methods
  applyFilters() {
    let filtered = [...this.allZonesList];

    // Apply search term
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(zone =>
        zone.nome?.toLowerCase().includes(search) ||
        zone.codePostal?.toString().includes(search)
      );
    }

    this.zonesList = filtered;
    this.totalElements = filtered.length;
    this.totalPages = Math.ceil(this.totalElements / this.pageSize);
    this.currentPage = 0;
    this.updatePaginatedZones();
  }

  updatePaginatedZones() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedZones = this.zonesList.slice(startIndex, endIndex);
  }

  clearFilters() {
    this.searchTerm = '';
    this.applyFilters();
  }

  // Action methods
  viewZone(zone: ZoneResp) {
    this.selectedZone = zone;
    this.showViewModal = true;
  }

  editZone(zone: ZoneResp) {
    this.selectedZone = { ...zone };
    this.showEditModal = true;
  }

  deleteZone(zone: ZoneResp) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la zone ${zone.nome} ?`)) {
      this.zoneService.delete(zone.id).subscribe({
        next: () => {
          this.loadZones();
          console.log('Deleted zone:', zone);
        },
        error: (error) => {
          console.error('Error deleting zone:', error);
        }
      });
    }
  }

  openCreateModal() {
    this.selectedZone = {
      id: '',
      nome: '',
      codePostal: 0
    };
    this.showCreateModal = true;
  }

  closeViewModal() {
    this.showViewModal = false;
    this.selectedZone = null;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedZone = null;
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.selectedZone = null;
  }

  updateZone() {
    if (this.selectedZone) {
      const zoneRequest: ZoneRequest = {
        nome: this.selectedZone.nome,
        codePostal: this.selectedZone.codePostal
      };

      this.zoneService.update(this.selectedZone.id, zoneRequest).subscribe({
        next: (updatedZone) => {
          this.loadZones();
          this.closeEditModal();
          console.log('Updated zone:', updatedZone);
        },
        error: (error) => {
          console.error('Error updating zone:', error);
        }
      });
    }
  }

  createZone() {
    if (this.selectedZone && this.selectedZone.nome && this.selectedZone.codePostal) {
      const zoneRequest: ZoneRequest = {
        nome: this.selectedZone.nome,
        codePostal: this.selectedZone.codePostal
      };

      this.zoneService.create(zoneRequest).subscribe({
        next: (newZone) => {
          this.loadZones();
          this.closeCreateModal();
          console.log('Created zone:', newZone);
        },
        error: (error) => {
          console.error('Error creating zone:', error);
        }
      });
    }
  }

  // Pagination methods
  goToPage(page: number) {
    this.currentPage = page;
    this.updatePaginatedZones();
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.updatePaginatedZones();
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePaginatedZones();
    }
  }
}
