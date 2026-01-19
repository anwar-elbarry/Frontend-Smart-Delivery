import {Component, computed, inject, signal} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {SidebarModel} from '../models/sidebar.model';
import {UserRole} from '../../models/enums/user-role.enum';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {

  private authService = inject(AuthService);

  isCollapsed = signal(false);

  menuItems = signal<SidebarModel[]>([
    // Gestionnaire logistique
    { label: 'Colis', icon: 'fa-solid fa-box', route: '/dashboard/colis' },
    { label: 'Clients', icon: 'fa-solid fa-users', route: '/dashboard/clients', roles: [UserRole.GESTIONNAIRE] },
    { label: 'Livreurs', icon: 'fa-solid fa-truck', route: '/dashboard/livreurs', roles: [UserRole.GESTIONNAIRE] },
    { label: 'Zones', icon: 'fa-solid fa-map-location-dot', route: '/dashboard/zone', roles: [UserRole.GESTIONNAIRE] },

    // Livreur
    { label: 'Mes Colis', icon: 'fa-solid fa-boxes-stacked', route: '/dashboard/mes-colis', roles: [UserRole.LIVREUR] },
    { label: 'Ma Tournée', icon: 'fa-solid fa-route', route: '/dashboard/tournee', roles: [UserRole.LIVREUR] },

    // Client expéditeur
    { label: 'Nouvelle Livraison', icon: 'fa-solid fa-plus-circle', route: '/nouvelle-livraison', roles: [UserRole.EXPEDITEUR] },
    { label: 'Mes Envois', icon: 'fa-solid fa-paper-plane', route: '/mes-envois', roles: [UserRole.EXPEDITEUR] },
    { label: 'Historique', icon: 'fa-solid fa-clock-rotate-left', route: '/historique', roles: [UserRole.EXPEDITEUR] },

    // Destinataire
    { label: 'Mes Réceptions', icon: 'fa-solid fa-inbox', route: '/mes-receptions', roles: [UserRole.DESTINATAIRE] },

    // Commun à tous
    { label: 'Suivi Colis', icon: 'fa-solid fa-magnifying-glass-location', route: '/suivi', roles: [UserRole.EXPEDITEUR, UserRole.DESTINATAIRE, UserRole.LIVREUR] },
    { label: 'Paramètres', icon: 'fa-solid fa-gear', route: '/settings' }
  ]);


  filteredMenu = computed(() => {
    const role = this.authService.getCurrentUser()?.role;

    return this.menuItems().filter(item => {
      if (!item.roles || item.roles.length === 0) return true;
      if (!role) return false;
      return item.roles.includes(role);
    });
  });

  toggleSidebar() {
    this.isCollapsed.update(val => !val);
  }
}
