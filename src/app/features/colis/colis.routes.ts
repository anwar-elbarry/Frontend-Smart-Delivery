import { Routes } from "@angular/router";

const COLIS_ROUTES: Routes = [
    {
        path: '',
        children: [
            { 
        path: '', 
        redirectTo: 'list', 
        pathMatch: 'full' 
      },
      { 
        path: 'list', 
        loadComponent: () => import('./components/coli-list/coli-list').then(m => m.ColiList)
      },
      { 
        path: 'create', 
        loadComponent: () => import('./components/coli-create/coli-create').then(m => m.ColiCreate)
      },
    //   { 
    //     path: ':id', 
    //     loadComponent: () => import('./components/colis-detail/colis-detail.component').then(m => m.ColisDetailComponent)
    //   },
    //   { 
    //     path: ':id/edit', 
    //     loadComponent: () => import('./components/colis-edit/colis-edit.component').then(m => m.ColisEditComponent)
    //   }
        ]
    }
]

export default COLIS_ROUTES;
