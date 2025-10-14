import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'termos',
    loadComponent: () => import('./pages/termos/termos.component').then(m => m.TermosComponent)
  },
  {
    path: 'carrinho',
    loadComponent: () => import('./pages/carrinho/carrinho.component').then(m => m.CarrinhoComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'produtos',
        pathMatch: 'full'
      },
      {
        path: 'produtos',
        loadComponent: () => import('./pages/admin/admin-produtos/admin-produtos.component').then(m => m.AdminProdutosComponent)
      },
      {
        path: 'pedidos',
        loadComponent: () => import('./pages/admin/admin-pedidos/admin-pedidos.component').then(m => m.AdminPedidosComponent)
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./pages/admin/admin-usuarios/admin-usuarios.component').then(m => m.AdminUsuariosComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
