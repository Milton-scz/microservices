import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Role } from 'src/app/model/Role';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user.service';
import { Permission } from 'src/app/model/Permission';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class RoleComponent implements OnInit {
  successMessage: string = '';
  errorMessage: string = '';
  roles: Role[] = []; // Lista de roles
  roleForm: FormGroup; // Formulario para roles
  currentRole: Role | null = null;
  private modalRef: NgbModalRef | null = null; // Referencia al modal
  allPermissions: Permission[] = []; // Lista de todos los permisos
  rolePermissions: string[] = []; // Permisos asignados al rol actual
  constructor(private userService: UserService, private fb: FormBuilder, private modalService: NgbModal) {
    this.roleForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadRoles(); // Cargar los roles al iniciar el componente
  }


  openAddPermissionsModal(role: any, content: any): void {
    this.currentRole = role;
    this.loadAllPermissions();
    this.loadAddRolePermissions(role.name, this.allPermissions);
    this.modalService.open(content);
  }

  openDelPermissionsModal(role: any, content: any): void {
    this.currentRole = role;
    this.loadAllPermissions();
    this.loadAddRolePermissions(role.name, this.allPermissions);
    this.modalService.open(content);
  }

  // Cargar todos los permisos disponibles
loadAllPermissions(): void {
  this.userService.getAllPermissions().subscribe({
    next: (data) => {
      this.allPermissions = data;
      console.log("todos los permisos:", this.allPermissions);
    },
    error: (error) => {
      console.error('Error al obtener permisos', error);
    },
  });
}

  // Cargar los permisos que tiene el rol actual
  loadAddRolePermissions(roleName: string, allPermissions: any[]): void {
    this.userService.getPermissionsByRoleName(roleName).subscribe({
      next: (data) => {
        if (data && data.permissions) {
          this.rolePermissions = data.permissions.map((permiso: Permission) => permiso.id);
          console.log("permisos del rol:", this.rolePermissions);


          const missingPermissions = allPermissions.filter((permiso: Permission) => !this.rolePermissions.includes(permiso.id));
          console.log("permisos que no tiene el rol:", missingPermissions);


        } else {
          console.log("El rol no tiene permisos");
        }
      },
      error: (error) => {
        console.error('Error al obtener permisos del rol', error);
      },
    });
  }



  // Manejar cambios en los permisos
  toggleAddPermission(permissionId: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      // Si está marcado, agregar permiso
      if (!this.rolePermissions.includes(permissionId)) {
        this.rolePermissions.push(permissionId);
      }
    } else {
      // Si se desmarca, eliminar de la lista
      this.rolePermissions = this.rolePermissions.filter(id => id !== permissionId);
    }
  }

toggleRemovePermission(permissionId: string, event: any): void {
  if (event.target.checked) {
    this.rolePermissions.push(permissionId);
    console.log("permisoadd:",this.rolePermissions)
  } else {
    this.rolePermissions = this.rolePermissions.filter(id => id !== permissionId);
    console.log("permisosssclear:",this.rolePermissions)
  }
}

// Guardar cambios de permisos del rol
savePermissions(): void {
  if (!this.currentRole || !this.rolePermissions || this.rolePermissions.length === 0) {
    console.warn("No hay permisos seleccionados para asignar.");
    return;
  }

  for (const permissionId of this.rolePermissions) {
    this.assignPermission(this.currentRole.id, permissionId);
  }
}

deletePermissionstoRole(): void {
  if (!this.currentRole || !this.rolePermissions || this.rolePermissions.length === 0) {
    console.warn("No hay permisos seleccionados para asignar.");
    return;
  }

  for (const permissionId of this.rolePermissions) {
    this.removePermission(this.currentRole.id, permissionId);
  }
}

assignPermission(roleId: string, permissionId: string): void {
  this.userService.assignPermissionToRole(roleId, permissionId).subscribe({
    next: () => {
      console.log(`Permiso ${permissionId} asignado correctamente al rol ${roleId}`);
    },
    error: (error) => {
      console.error(`Error al asignar permiso ${permissionId}:`, error);
    },
  });
}

removePermission(roleId: string, permissionId: string): void {
  this.userService.deletePermissionToRole(roleId, permissionId).subscribe({
    next: () => {
      console.log(`Permiso ${permissionId} asignado correctamente al rol ${roleId}`);
    },
    error: (error) => {
      console.error(`Error al asignar permiso ${permissionId}:`, error);
    },
  });
}
  loadRoles(): void {
    this.userService.getAllRoles().subscribe({
      next: (data) => {
        console.log(data);
        this.roles = data;
      },
      error: (error) => {
        console.error('Error al obtener roles', error);
      },
    });
  }

  open(content: any) {
    this.modalRef = this.modalService.open(content);
  }

  editRole(role: Role, content: any): void {
    this.currentRole = role;
    this.roleForm.patchValue({
      id: role.id,
      name: role.name,
      description: role.description,
    });
    this.modalRef = this.modalService.open(content);
  }

  onSubmit(): void {
    if (this.roleForm.valid) {
      const formValue = this.roleForm.value;
      const isEditing = !!this.currentRole;

      const roleData: Role = {
        id: formValue.id,
        name: formValue.name,
        description: formValue.description,
      };

      if (isEditing) {
        const roleDataUpdate: Role = {
          id: this.currentRole.id,
          name: formValue.name,
          description: formValue.description,
        };

        console.log("Editando rol:", roleDataUpdate);
        this.userService.updateRole(roleDataUpdate).subscribe(() => {
          this.successMessage = 'Rol actualizado correctamente';
          this.loadRoles(); // Recargar la lista de roles
          this.closeModal(); // Cerrar modal después de editar
        });
      } else {
        console.log("Creando rol:", roleData);
        this.userService.createRol(roleData).subscribe(() => {
          this.successMessage = 'Rol creado correctamente';
          this.loadRoles(); // Recargar la lista de roles
          this.closeModal(); // Cerrar modal después de crear
        });
      }
    } else {
      console.log("El formulario no es válido");
    }
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.close(); // Cerrar el modal correctamente
      this.modalRef = null;
    }
  }

  deleteRole(roleId: string): void {
    this.userService.deleteRole(roleId).subscribe({
      next: () => {
        this.successMessage = 'Rol eliminado con éxito';
        this.loadRoles();  // Recargar la lista de roles
      },
      error: (error) => {
        this.errorMessage = 'Error al eliminar rol';
        console.error('Error al eliminar rol', error);
      },
    });
  }
}
