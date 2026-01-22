import { Routes } from "@angular/router";

const DASH_ROUTES: Routes =[
        {
            path:'',
            loadComponent: () => import('./dashboard-component/dashboard-component').then(m => m.DashboardComponent),
            children: [
  { 
        path: '', 
        redirectTo: 'colis', 
        pathMatch: 'full' 
      },{
        path: 'colis',
        loadChildren: () => import('../colis/colis.routes').then(m => m.default)
      },
      {
        path: 'livreurs',
        loadComponent: () => import('../livreur/components/livreur-list/livreur-list').then(m => m.LivreurList)
      },
      {
        path: 'zone',
        loadComponent: () => import('../zone/components/zone-list/zone-list').then(m => m.ZoneList)
      }
      ,
      {
        path: 'clients',
        loadComponent: () => import('../clinet/component/client-list/client-list').then(m => m.ClientList)
      }
            ]
        }
]

export default DASH_ROUTES;