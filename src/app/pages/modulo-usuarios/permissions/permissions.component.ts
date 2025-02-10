import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Permission } from 'src/app/model/Permission';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class PermissionComponent implements OnInit {
  successMessage: string = '';
  errorMessage: string = '';
  permissions: Permission[] = []; // Lista de permisos
  permissionForm: FormGroup; // Formulario para permisos
  currentPermission: Permission | null = null;
  private modalRef: NgbModalRef | null = null; // Referencia al modal

  constructor(private userService: UserService, private fb: FormBuilder, private modalService: NgbModal) {
    this.permissionForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadPermissions(); // Cargar los permisos al iniciar el componente
  }

  loadPermissions(): void {
    this.userService.getAllPermissions().subscribe({
      next: (data) => {
        console.log(data);
        this.permissions = data;
      },
      error: (error) => {
        console.error('Error al obtener permisos', error);
      },
    });
  }

  open(content: any) {
    this.modalRef = this.modalService.open(content);
  }

  editPermission(permission: Permission, content: any): void {
    this.currentPermission = permission;
    this.permissionForm.patchValue({
      id: permission.id,
      name: permission.name,
      description: permission.description,
    });
    this.modalRef = this.modalService.open(content);
  }

  onSubmit(): void {
    if (this.permissionForm.valid) {
      const formValue = this.permissionForm.value;
      const isEditing = !!this.currentPermission;

      const permissionData: Permission = {
        id: formValue.id,
        name: formValue.name,
        description: formValue.description,
      };

      if (isEditing) {
        const permissionDataUpdate: Permission = {
          id: this.currentPermission.id,
          name: formValue.name,
          description: formValue.description,
        };

        console.log("Editando permiso:", permissionDataUpdate);
        this.userService.updatePermission(permissionDataUpdate).subscribe(() => {
          this.successMessage = 'Permiso actualizado correctamente';
          this.loadPermissions(); // Recargar la lista de permisos
          this.closeModal(); // Cerrar modal después de editar
        });
      } else {
        console.log("Creando permiso:", permissionData);
        this.userService.createPermission(permissionData).subscribe(() => {
          this.successMessage = 'Permiso creado correctamente';
          this.loadPermissions(); // Recargar la lista de permisos
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

  deletePermission(permissionId: string): void {
    this.userService.deletePermission(permissionId).subscribe({
      next: () => {
        this.successMessage = 'Permiso eliminado con éxito';
        this.loadPermissions();  // Recargar la lista de permisos
      },
      error: (error) => {
        this.errorMessage = 'Error al eliminar permiso';
        console.error('Error al eliminar permiso', error);
      },
    });
  }
}
