import {Component, inject, OnInit, signal, computed} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ProduitService} from '../../produit.service';
import {ProduitResponse} from '../../models/produit.response';
import {PageRequest} from '../../../../core/models/page.request.model';
import {ProduitCreate} from '../produit-create/produit-create';

@Component({
  selector: 'app-produit-list',
  imports: [CommonModule, FormsModule, ProduitCreate],
  standalone: true,
  templateUrl: './produit-list.html',
  styleUrl: './produit-list.css',
})
export class ProduitList implements OnInit {
    private produitService = inject(ProduitService);

    // Signals pour les données
    private allProduitsData = signal<ProduitResponse[]>([]);

    // États de chargement
    isLoading = signal(true);
    hasError = signal(false);

    // Modal properties
    showViewModal = false;
    showEditModal = false;
    showCreateModal = false;
    selectedProduit = signal<ProduitResponse | null>(null);

    // Filter properties
    searchTerm = signal('');
    filterCategorie = signal('');

    // Pagination properties
    pageRequest = signal<PageRequest>({
      page: 0,
      size: 10,
    });
    totalElements = 0;
    totalPages = 0;
    currentPage = 0;
    pageSize = 10;

    // Liste filtrée de produits
    produitList = computed(() => {
      const produits = this.allProduitsData();
      let filtered = [...produits];

      // Apply search term
      const search = this.searchTerm().toLowerCase().trim();
      if (search) {
        filtered = filtered.filter(produit =>
          produit.nom?.toLowerCase().includes(search) ||
          produit.categorie?.toLowerCase().includes(search) ||
          produit.id?.toLowerCase().includes(search)
        );
      }

      // Apply category filter
      const categorie = this.filterCategorie();
      if (categorie) {
        filtered = filtered.filter(produit =>
          produit.categorie === categorie
        );
      }

      return filtered;
    });

    // Produits paginés
    paginatedProduits = computed(() => {
      const startIndex = this.currentPage * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.produitList().slice(startIndex, endIndex);
    });

    // Computed stats
    totalProduits = computed(() => {
      return this.allProduitsData().length;
    });

    // Catégories pour les stats
    categories = ['Électronique', 'Vêtements', 'Alimentation', 'Cosmétiques'];

    getCategorieCount(categorie: string) {
      return this.allProduitsData().filter(p => p.categorie === categorie).length;
    }

    ngOnInit() {
      this.loadProducts();
    }

    loadProducts() {
      this.isLoading.set(true);
      this.hasError.set(false);

      this.produitService.getAll(this.pageRequest()).subscribe({
        next: response => {
          this.allProduitsData.set(response.content);
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;
          this.isLoading.set(false);
        },
        error: err => {
          console.error('Erreur lors du chargement des produits:', err);
          this.hasError.set(true);
          this.isLoading.set(false);
        }
      });
    }

    // Filter methods
    applyFilters() {
      this.currentPage = 0;
      this.updatePagination();
    }

    updatePagination() {
      const filtered = this.produitList();
      this.totalElements = filtered.length;
      this.totalPages = Math.ceil(this.totalElements / this.pageSize);
    }

    clearFilters() {
      this.searchTerm.set('');
      this.filterCategorie.set('');
      this.currentPage = 0;
    }

    // Pagination methods
    nextPage() {
      if (this.currentPage < this.totalPages - 1) {
        this.currentPage++;
      }
    }

    previousPage() {
      if (this.currentPage > 0) {
        this.currentPage--;
      }
    }

    goToPage(page: number) {
      this.currentPage = page;
    }

    // Action methods
    openCreateModal() {
      this.selectedProduit.set({
        id: '',
        nom: '',
        poids: 0,
        categorie: '',
        prix: 0
      });
      this.showCreateModal = true;
    }

    closeCreateModal() {
      this.showCreateModal = false;
      this.selectedProduit.set(null);
    }

    handleProduitCreated(produit: ProduitResponse) {
      const current = this.allProduitsData();
      this.allProduitsData.set([...current, produit]);
      this.showCreateModal = false;
    }

    viewProduit(produit: ProduitResponse) {
      this.selectedProduit.set(produit);
      this.showViewModal = true;
    }

    closeViewModal() {
      this.showViewModal = false;
      this.selectedProduit.set(null);
    }

    editProduit(produit: ProduitResponse) {
      this.selectedProduit.set({ ...produit });
      this.showEditModal = true;
    }

    closeEditModal() {
      this.showEditModal = false;
      this.selectedProduit.set(null);
    }

    handleProduitUpdated(produit: ProduitResponse) {
      const current = this.allProduitsData();
      const index = current.findIndex(p => p.id === produit.id);
      if (index !== -1) {
        current[index] = produit;
        this.allProduitsData.set([...current]);
      }
      this.showEditModal = false;
    }

    deleteProduit(produit: ProduitResponse) {
      if (confirm(`Êtes-vous sûr de vouloir supprimer le produit ${produit.nom} ?`)) {
        this.produitService.delete(produit.id).subscribe({
          next: () => {
            const current = this.allProduitsData();
            this.allProduitsData.set(current.filter(p => p.id !== produit.id));
          },
          error: (error) => {
            console.error('Erreur lors de la suppression du produit:', error);
            alert('Erreur lors de la suppression du produit');
          }
        });
      }
    }

    // Helper pour obtenir l'icône par catégorie
    getCategoryIcon(categorie: string): string {
      const icons: { [key: string]: string } = {
        'Électronique': 'fa-laptop',
        'Vêtements': 'fa-shirt',
        'Alimentation': 'fa-utensils',
        'Cosmétiques': 'fa-spray-can',
      };
      return icons[categorie] || 'fa-cube';
    }

    getCategoryColor(categorie: string): string {
      const colors: { [key: string]: string } = {
        'Électronique': 'blue',
        'Vêtements': 'green',
        'Alimentation': 'orange',
        'Cosmétiques': 'pink',
      };
      return colors[categorie] || 'indigo';
    }
}
