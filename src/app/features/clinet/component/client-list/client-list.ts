import {Component, inject, OnInit, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../../core/models/auth/user.rensponse';
import { Provider } from '../../../../core/models/auth/provider.enum';
import {UserService} from '../../../../core/services/user.service';
import {filter, Observable} from 'rxjs';
import {UserRole} from '../../../../core/models/enums/user-role.enum';
import {UserUpdateRequest} from '../../../../core/models/auth/user.update.request';
import {RoleService} from '../../../../core/services/role.service';

@Component({
  selector: 'app-client-list',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './client-list.html',
  styleUrl: './client-list.css',
})
export class ClientList implements OnInit {
  private userService = inject(UserService);
  private roleService= inject(RoleService);
  clientsList = signal<User[]>([]);

  // Pagination properties
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  // Modal properties
  showViewModal = false;
  showEditModal = false;
  selectedClient: User | null = null;

  // Filter properties
  searchTerm = '';
  filterStatus = '';

  // All clients (unfiltered)
  private allClientsList: User[] = [];

  ngOnInit() {
    this.loadClients();
  }
  // Filter methods
  applyFilters() {
    let filtered = [...this.allClientsList];

    // Apply search term
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(client =>
        client.nom?.toLowerCase().includes(search) ||
        client.prenom?.toLowerCase().includes(search) ||
        client.email?.toLowerCase().includes(search) ||
        client.telephone?.includes(search) ||
        client.username?.toLowerCase().includes(search)
      );
    }

    // Apply status filter
    if (this.filterStatus === 'active') {
      filtered = filtered.filter(client => client.enable);
    } else if (this.filterStatus === 'inactive') {
      filtered = filtered.filter(client => !client.enable);
    }

    this.clientsList.set(filtered);
    this.totalElements = filtered.length;
    this.totalPages = Math.ceil(this.totalElements / this.pageSize);
    this.currentPage = 0;
  }

  clearFilters() {
    this.searchTerm = '';
    this.filterStatus = '';
    this.applyFilters();
  }

  // Action methods
  viewClient(client: User) {
    this.selectedClient = client;
    this.showViewModal = true;
  }

  editClient(client: User) {
    this.selectedClient = { ...client };
    this.showEditModal = true;
  }

  deleteClient(client: User) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le client ${client.nom} ${client.prenom} ?`)) {
      this.allClientsList = this.allClientsList.filter(c => c.id !== client.id);
      this.applyFilters();
      console.log('Deleted client:', client);
    }
  }

  toggleClientStatus(client: User) {
    const action = client.enable ? 'désactiver' : 'activer';
    if (confirm(`Êtes-vous sûr de vouloir ${action} le client ${client.nom} ${client.prenom} ?`)) {
      const updatedRequest: UserUpdateRequest = {
        id: client.id,
        nom: client.nom,
        prenom: client.prenom,
        email: client.email,
        username: client.username,
        telephone: client.telephone,
        adress: client.adress,
        roleId: client.role.id,
        enable: !client.enable,
        provider: client.provider,
        providerId: client.providerId
      };

      // 2. Appeler le service et s'abonner à la réponse
      this.userService.update(client.id, updatedRequest).subscribe({
        next: (updatedUserFromApi) => {
          // 3. Mettre à jour la liste locale uniquement en cas de succès
          const index = this.allClientsList.findIndex(c => c.id === client.id);
          if (index !== -1) {
            // Remplacer l'ancien objet par celui retourné par l'API
            this.allClientsList[index] = updatedUserFromApi;
          }
          this.applyFilters(); // Rafraîchir la vue
          console.log(`Client ${action}d avec succès:`, updatedUserFromApi);
        },
        error: (err) => {
          console.error(`Erreur lors de la tentative de ${action} le client`, err);
          // Optionnel : Afficher une notification d'erreur à l'utilisateur
        }
      });
    }
  }

  closeViewModal() {
    this.showViewModal = false;
    this.selectedClient = null;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedClient = null;
  }

  updateClient() {
    if (this.selectedClient) {
      let updatedClient :UserUpdateRequest = {
        id: this.selectedClient.id,
        nom: this.selectedClient.nom,
        prenom: this.selectedClient.prenom,
        email: this.selectedClient.email,
        username: this.selectedClient.username,
        telephone: this.selectedClient.telephone,
        adress: this.selectedClient.adress,
        roleId: this.selectedClient.role.id,
        enable: this.selectedClient.enable,
        provider: this.selectedClient.provider,
        providerId:this.selectedClient.providerId
      }
     this.userService.update(this.selectedClient.id,updatedClient).subscribe({
       next: (updatedUser) => {
         const index = this.allClientsList.findIndex(c => c.id === updatedUser.id);
         if(index !== -1){
           this.allClientsList[index] = updatedUser;
         }
         this.applyFilters();
         this.closeEditModal();
       },
       error: err => {
         console.error('Erreur lors de la mise à jour du client', err);
       }
     })
    }
  }

  // Pagination methods
  goToPage(page: number) {
    this.currentPage = page;
  }

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

  loadClients(){
    this.userService.getAll().subscribe({
      next: users => {
        this.allClientsList = users.filter(user => user.role.roleName == "CLIENT");
        console.log(this.allClientsList);
        this.applyFilters();
      }
    })
  }
}
