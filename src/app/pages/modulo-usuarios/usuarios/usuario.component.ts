import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/model/user';
import { UserSave } from 'src/app/model/UserSave';
import { Role } from 'src/app/model/Role';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'; // Importa NgbModalRef
import { UserUpdate } from 'src/app/model/UserUpdate';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class UsuarioComponent implements OnInit {
  successMessage: string = '';
  errorMessage: string = '';
  users: User[] = [];
  roles: Role[] = [];
  userForm: FormGroup;
  currentUser: User | null = null;
  private modalRef: NgbModalRef | null = null; // Referencia al modal

  constructor(private userService: UserService, private fb: FormBuilder, private modalService: NgbModal) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      name: ['', Validators.required],
      cedula: ['', Validators.required],
      celular: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      role: ['USER'],
    });
  }

  open(content: any) {
    this.modalRef = this.modalService.open(content);
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }


  editUser(user: User, content: any): void {
    this.currentUser = user;

    this.userForm.patchValue({
      id: user.id,
      username: user.username,
      name: user.userDetails?.name,
      email: user.email,
      cedula: user.userDetails?.cedula,
      celular: user.userDetails?.celular,
      password: null,
      role:  this.roles.find(r => r.name === user.role.name) || null,
    });
    this.modalRef = this.modalService.open(content);
  }


  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        console.log(data);
        this.users = data;
      },
      error: (error) => {
        console.error('Error al obtener usuarios', error);
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
        console.error('Error al obtener usuarios', error);
      },
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      const isEditing = !!this.currentUser; // Verifica si es edición

      const userData: UserSave = {

        username: formValue.username,
        password: formValue.password || null, // Si no existe, se envía null
        email: formValue.email,
        name: formValue.name,
        cedula: formValue.cedula,
        roleName: formValue.role.name,
        celular: formValue.celular,
      };

      if (isEditing) {
        // Editar usuario
        const userDataUpdate: UserUpdate = {
          id: this.currentUser.id,
          username: formValue.username,
          password: formValue.password || null, // Aquí también aplicamos la misma lógica
          email: formValue.email,
          roleName: formValue.role.name,
          userDetails: {
            name: formValue.name,
            cedula: formValue.cedula,
            celular: formValue.celular,
          }
        };

        console.log("Editando usuario:", userDataUpdate);
        this.userService.updateUser(userDataUpdate).subscribe(() => {
          this.successMessage = 'Usuario actualizado correctamente';
          this.loadUsers();
          this.closeModal(); // Cierra el modal después de editar
        });
      } else {
        // Crear usuario
        console.log("Creando usuario:", userData);
        this.userService.createUser(userData).subscribe(() => {
          this.successMessage = 'Usuario creado correctamente';
          this.loadUsers();
          this.closeModal(); // Cierra el modal después de crear
        });
      }
    } else {
      console.log("El formulario no es válido");
    }
  }


  closeModal() {
    if (this.modalRef) {
      this.modalRef.close(); // Cierra el modal correctamente
      this.modalRef = null;
    }
  }

  // Eliminar un usuario
  deleteUser(userId: string): void {
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.successMessage = 'Usuario eliminado con éxito';
        this.loadUsers();  // Recargar la lista de usuarios
      },
      error: (error) => {
        this.errorMessage = 'Error al eliminar usuario';
        console.error('Error al eliminar usuario', error);
      },
    });
  }
}
