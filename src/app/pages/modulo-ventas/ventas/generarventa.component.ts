import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { Category } from 'src/app/model/Category';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Almacen } from 'src/app/model/Almacen';
import { Product } from 'src/app/model/Product';
import { AjusteInventario } from 'src/app/model/AjusteInventario';
import { AjusteInventarioDto } from 'src/app/model/AjusteInventarioDto';
import { UserService } from 'src/app/services/user.service';
import { VentaService } from 'src/app/services/venta.service';
import { RouterModule } from '@angular/router';
import { User } from 'src/app/model/User';
import { FormsModule } from '@angular/forms';
import { PagoFacilService } from 'src/app/services/pagofacil.service';

@Component({
  selector: 'app-generarventa',
  templateUrl: './generarventa.component.html',
  styleUrls: ['./ventas.component.scss'],
  imports: [ReactiveFormsModule, CommonModule,RouterModule,FormsModule],
})
export class GenerarVentaComponent implements OnInit {

  form: FormGroup;
  products = [];
  users : User[] = [];
  ventas = [];
  carrito: any[] = [];
  total = 0;
  selectedCliente: User;
  submitted = false;
  qrImage: string | null = null;
  nroTransaccion :string | null = null;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private ventaService: VentaService,
    private pagoFacilService: PagoFacilService

  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      userId: ['', Validators.required],
      name: ['', [Validators.required, Validators.minLength(3)]],
      cedula: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      ciNit: ['', [Validators.required]],
      tcRazonSocial: ['', [Validators.required]],
      tnMonto: [0, [Validators.required]],
      tnTipoServicio: [0, Validators.required]
    });
    this.loadUsers();

  }
  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      console.log('Formulario no válido:', this.form.errors);

      // Mostrar errores de cada campo
      Object.keys(this.form.controls).forEach(key => {
        const controlErrors = this.form.get(key)?.errors;
        if (controlErrors) {
          console.log(`Errores en ${key}:`, controlErrors);
        }
      });

      return;
    }

    const requestData = this.form.value;

    this.pagoFacilService.generarCobroSimulado(requestData).subscribe({
      next: (response) => {
        this.qrImage = response.qrImage;
        this.nroTransaccion = response.nroTransaccion;
        console.log("Qr:", this.qrImage);
        console.log("Numero Transaccion:", this.nroTransaccion);
      },
      error: (error) => {
        console.error('Error al generar cobro:', error);
      }
    });
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
   actualizarDatos = () => {
    this.form.patchValue({
      id: this.selectedCliente.id,
      name: this.selectedCliente.userDetails?.name,
      tcCorreo: this.selectedCliente.email,
      tnTelefono: this.selectedCliente.userDetails?.celular,
      cedula: this.selectedCliente.userDetails?.cedula,
      tcRazonSocial: 'GRUPO-01',
      tnMonto: 0.01

    });

  }
  onClienteSelect(event: any) {
    const selectedUserId = event.target.value;

    // Encontrar el usuario seleccionado de la lista
    const selectedUser = this.users.find(user => user.id === selectedUserId);

    if (selectedUser) {
      // Rellenar el formulario con los datos del usuario
      this.form.patchValue({
        name: selectedUser.userDetails.name,
        cedula: selectedUser.userDetails.cedula,
        email: selectedUser.email,
        telefono: selectedUser.userDetails.celular,
        ciNit: selectedUser.userDetails.cedula,
        tcRazonSocial: 'GRUPO-01',
      tnMonto: 0.01

      });
    }
  }


  confirmarVenta() {
    console.log('Venta confirmada:', this.carrito,"Total:",this.total);
  }


}
