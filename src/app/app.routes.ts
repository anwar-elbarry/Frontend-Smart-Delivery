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
    loadComponent: () => import('./features/dashboard/dashboard-component/dashboard-component').then(m  => m.DashboardComponent),
    canActivate:[authGard]
  }

];
export default routes
