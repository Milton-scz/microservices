import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-categoria',
  templateUrl: './ajuste.component.html',
  styleUrls: ['./ajuste.component.scss'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class VentasComponent implements OnInit {
  ventaForm: FormGroup;
  products = [];
  clientes = [];
  ventas = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private userService: UserService,
    private ventaService: VentaService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadClientes();
    this.loadVentas();

    this.ventaForm = this.fb.group({
      productId: ['', Validators.required],
      clienteId: ['', Validators.required],
      fecha: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.min(1)]],
      total: [{ value: '', disabled: true }]
    });

    this.onChanges();
  }

  onChanges(): void {
    this.ventaForm.get('cantidad').valueChanges.subscribe(cantidad => {
      const productoId = this.ventaForm.get('productId').value;
      this.calculateTotal(productoId, cantidad);
    });
  }

  calculateTotal(productoId: number, cantidad: number): void {
    const product = this.products.find(p => p.id === productoId);
    if (product) {
      this.ventaForm.patchValue({ total: product.price * cantidad });
    }
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  loadClientes(): void {
    this.userService.getAllUsers().subscribe(clientes => {
      this.clientes = clientes;
    });
  }

  loadVentas(): void {
    this.ventaService.getVentas().subscribe(ventas => {
      this.ventas = ventas;
    });
  }

  onSubmit(): void {
    if (this.ventaForm.valid) {
      this.ventaService.addVenta(this.ventaForm.value).subscribe(() => {
        this.loadVentas();  // Recarga la lista de ventas
      });
    }
  }

  deleteVenta(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta venta?')) {
      this.ventaService.deleteVenta(id).subscribe(() => {
        this.loadVentas();  // Recarga la lista de ventas después de la eliminación
      });
    }
  }

  open(ventaModal): void {
    ventaModal.show();
  }
}
