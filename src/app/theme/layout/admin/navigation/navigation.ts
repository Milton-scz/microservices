export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  role?: string[];
  isMainParent?: boolean;
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard',
        icon: 'ti ti-dashboard',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'page',
    title: 'Pages',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'Modulo Usuarios',
        title: 'Modulo Usuarios',
        type: 'collapse',
        icon: 'ti ti-key',
        children: [
          {
            id: 'usuarios',
            title: 'Usuarios',
            type: 'item',
            url: '/usuarios',
            classes: 'nav-item',
            icon: 'ti ti-brand-chrome'
          },
          {
            id: 'roles',
            title: 'Roles',
            type: 'item',
            classes: 'nav-item',
            url: '/roles',
            icon: 'ti ti-vocabulary',

          },
          {
            id: 'permisos',
            title: 'Permisos',
            type: 'item',
            classes: 'nav-item',
            url: '/permisos',
            icon: 'ti ti-vocabulary',

          }
        ]
      },
      {
        id: 'Modulo inventario',
        title: 'Modulo Inventario',
        type: 'collapse',
        icon: 'ti ti-key',
        children: [
          {
            id: 'categoria',
            title: 'Categoria',
            type: 'item',
            url: '/categorias',
            classes: 'nav-item',
            icon: 'ti ti-brand-chrome'
          },
          {
            id: 'productos',
            title: 'Productos',
            type: 'item',
            classes: 'nav-item',
            url: '/productos',
            icon: 'ti ti-vocabulary',

          },
          {
            id: 'almacenes',
            title: 'Almacenes',
            type: 'item',
            classes: 'nav-item',
            url: '/almacenes',
            icon: 'ti ti-vocabulary',

          },
          {
            id: 'ofertas',
            title: 'Ofertas',
            type: 'item',
            classes: 'nav-item',
            url: '/ofertas',
            icon: 'ti ti-vocabulary',

          },

          {
            id: 'ajustes',
            title: 'Ajustes Inventario',
            type: 'item',
            classes: 'nav-item',
            url: '/ajustes',
            icon: 'ti ti-vocabulary',

          },
        ]
      },
      {
        id: 'Modulo Ventas',
        title: 'Modulo Ventas',
        type: 'collapse',
        icon: 'ti ti-key',
        children: [
          {
            id: 'ventas',
            title: 'Ventas',
            type: 'item',
            url: '/ventas',
            classes: 'nav-item',
            icon: 'ti ti-brand-chrome'
          },
          {
            id: 'pagos',
            title: 'Pagos',
            type: 'item',
            classes: 'nav-item',
            url: '/pagos',
            icon: 'ti ti-vocabulary',

          }
        ]
      },
      {
        id: 'modulo reportes',
        title: 'Modulo Reportes',
        type: 'collapse',
        icon: 'ti ti-key',
        children: [
          {
            id: 'reportes',
            title: 'Reportes',
            type: 'item',
            url: '/reportes',
            classes: 'nav-item',
            icon: 'ti ti-brand-chrome'
          },
          {
            id: 'views',
            title: 'Views',
            type: 'item',
            classes: 'nav-item',
            url: '/views',
            icon: 'ti ti-vocabulary',

          }
        ]
      }
    ]
  },


];
