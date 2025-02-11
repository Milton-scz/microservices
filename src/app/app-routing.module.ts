import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { AlmacenComponent } from './pages/modulo-inventario/almacenes/almacenes.component';


const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },

      {
        path: 'dashboard',
        loadComponent: () => import('./demo/dashboard/default/default.component').then((c) => c.DefaultComponent)
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./pages/modulo-usuarios/usuarios/usuario.component').then((c)=> c.UsuarioComponent)
      },
      {
        path: 'roles',
        loadComponent: () => import('./pages/modulo-usuarios/roles/roles.component').then((c)=> c.RoleComponent)
      },
      {
        path: 'permisos',
        loadComponent: () => import('./pages/modulo-usuarios/permissions/permissions.component').then((c)=> c.PermissionComponent)
      },
      {
        path: 'categorias',
        loadComponent: () => import('./pages/modulo-inventario/categorias/categoria.component').then((c)=> c.CategoriaComponent)
      },
      {
        path: 'productos',
        loadComponent: () => import('./pages/modulo-inventario/productos/producto.component').then((c)=> c.ProductoComponent)
      },

      {
        path: 'ofertas',
        loadComponent: () => import('./pages/modulo-inventario/ofertas/ofertas.component').then((c)=> c.OfertasComponent)
      },
      {
        path: 'almacenes',
        loadComponent: () => import('./pages/modulo-inventario/almacenes/almacenes.component').then((c)=> c.AlmacenComponent)
      },
      {
        path: 'ajustes',
        loadComponent: () => import('./pages/modulo-inventario/ajustesinventarios/ajuste.component').then((c)=> c.AjusteComponent)
      },
      {
        path: 'ventas',
        loadComponent: () => import('./pages/modulo-ventas/ventas/ventas.component').then((c)=> c.VentasComponent)
      },
      {
        path: 'ventas',
        loadComponent: () => import('./pages/modulo-ventas/ventas/ventas.component').then((c)=> c.VentasComponent)
      },
      {
        path: 'generar-venta',
        loadComponent: () => import('./pages/modulo-ventas/ventas/generarventa.component').then((c)=> c.GenerarVentaComponent)
      },
      {
        path: 'pagos',
        loadComponent: () => import('./demo/other/sample-page/sample-page.component')
      },
      {
        path: 'reportes',
        loadComponent: () => import('./demo/other/sample-page/sample-page.component')
      },
      {
        path: 'views',
        loadComponent: () => import('./demo/other/sample-page/sample-page.component')
      }
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./demo/pages/authentication/authentication.module').then((m) => m.AuthenticationModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
