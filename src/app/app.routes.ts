import { Routes } from '@angular/router';
import { authGard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadComponent: ()=> import('./features/public/login/login.component/login.component').then(m => m.LoginComponent)
  },{
  path: '',
  redirectTo: '/login',
  pathMatch: 'full'
  },{
  path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m  => m.default),
    canActivate:[authGard]
  }

];
export default routes
