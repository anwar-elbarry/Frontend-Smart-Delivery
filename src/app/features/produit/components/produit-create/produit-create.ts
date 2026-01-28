import {Component, inject, input, output, signal, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ProduitService} from '../../produit.service';
import {ProduitRequest} from '../../models/produit.request';
import {ProduitResponse} from '../../models/produit.response';

@Component({
  selector: 'app-produit-create',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './produit-create.html',
  styleUrl: './produit-create.css',
})
export class ProduitCreate implements OnInit {
  private produitService = inject(ProduitService);

  // Input signal avec le produit sélectionné (optionnel pour la création)
  selectedProduit = input.required<ProduitResponse>();
  isEditMode = input<boolean>(false);

  // Output signals pour communiquer avec le parent
  onCreate = output<ProduitResponse>();
  onUpdate = output<ProduitResponse>();
  onClose = output<void>();

  // Signals pour l'état du composant
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  // Catégories disponibles
  categories = ['Électronique', 'Vêtements', 'Alimentation', 'Cosmétiques'];

  // Données du formulaire
  formData: ProduitRequest = {
    nom: '',
    poids: 0,
    categorie: '',
    prix: 0
  };

  ngOnInit() {
    // Initialiser le formulaire avec les données du produit sélectionné
    const produit = this.selectedProduit();
    if (produit && produit.id) {
      this.formData = {
        nom: produit.nom || '',
        poids: produit.poids || 0,
        categorie: produit.categorie || '',
        prix: produit.prix || 0
      };
    }
  }

  submitForm() {
    if (this.isEditMode()) {
      this.updateProduit();
    } else {
      this.createProduit();
    }
  }

  createProduit() {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.produitService.create(this.formData).subscribe({
      next: (newProduit) => {
        this.successMessage.set('Produit créé avec succès !');
        this.isLoading.set(false);
        this.onCreate.emit(newProduit);
        this.closeCreateModal();
      },
      error: (error) => {
        console.error('Erreur lors de la création du produit:', error);
        this.errorMessage.set('Erreur lors de la création du produit. Veuillez réessayer.');
        this.isLoading.set(false);
      }
    });
  }

  updateProduit() {
    if (!this.validateForm()) {
      return;
    }

    const produitId = this.selectedProduit().id;
    if (!produitId) {
      this.errorMessage.set('ID du produit manquant');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.produitService.update(produitId, this.formData).subscribe({
      next: (updatedProduit) => {
        this.successMessage.set('Produit mis à jour avec succès !');
        this.isLoading.set(false);
        this.onUpdate.emit(updatedProduit);
        this.closeEditModal();
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du produit:', error);
        this.errorMessage.set('Erreur lors de la mise à jour du produit. Veuillez réessayer.');
        this.isLoading.set(false);
      }
    });
  }

  validateForm(): boolean {
    this.errorMessage.set('');

    if (!this.formData.nom || this.formData.nom.trim() === '') {
      this.errorMessage.set('Le nom du produit est requis');
      return false;
    }

    if (!this.formData.categorie || this.formData.categorie.trim() === '') {
      this.errorMessage.set('La catégorie est requise');
      return false;
    }

    if (this.formData.poids <= 0) {
      this.errorMessage.set('Le poids doit être supérieur à 0');
      return false;
    }

    if (this.formData.prix <= 0) {
      this.errorMessage.set('Le prix doit être supérieur à 0');
      return false;
    }

    return true;
  }

  closeCreateModal() {
    this.onClose.emit();
  }

  closeEditModal() {
    this.onClose.emit();
  }

  resetForm() {
    this.formData = {
      nom: '',
      poids: 0,
      categorie: '',
      prix: 0
    };
    this.errorMessage.set('');
    this.successMessage.set('');
  }
}
