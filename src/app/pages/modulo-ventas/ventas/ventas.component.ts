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

@Component({
  selector: 'app-categoria',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss'],
  imports: [ReactiveFormsModule, CommonModule,RouterModule],
})
export class VentasComponent implements OnInit {
  @ViewChild('ventaModal') ventaModal: any;
  ventaForm: FormGroup;
  products = [];
  clientes : User[] = [];
  ventas = [];
  carrito: any[] = [];
  total = 0;
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private userService: UserService,
    private ventaService: VentaService,
    private modalService: NgbModal
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


  }



  calculateTotal(): void {
    this.total = this.carrito.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
    this.ventaForm.patchValue({ total: this.total });
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe(products => {
      this.products = products;
    });
  }

  loadClientes(): void {
    this.userService.getAllUsers().subscribe(clientes => {
      this.clientes = clientes;
    });
  }

  loadVentas(): void {
    this.ventaService.getAllVentas().subscribe(ventas => {
      this.ventas = ventas;
    });
  }

  onSubmit(): void {
    if (this.ventaForm.valid) {
      this.ventaService.createVenta(this.ventaForm.value).subscribe(() => {
        this.loadVentas();  // Recarga la lista de ventas
      });
    }
  }

  deleteVenta(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta venta?')) {
      this.ventaService.deleteVenta(id).subscribe(() => {
        this.loadVentas();  // Recarga la lista de ventas después de la eliminación
      });
    }
  }

  open(content: any) {
    this.modalService.open(content, { centered: true, size: 'xl' });
  }
  removeFromCart(productId: string): void {
    // Lógica para encontrar el producto en el carrito
    const existingItem = this.carrito.find(item => item.id === productId);

    if (existingItem) {
      // Reducir la cantidad del producto
      existingItem.quantity--;

      // Si la cantidad es 0, eliminar el producto del carrito
      if (existingItem.quantity <= 0) {
        this.carrito = this.carrito.filter(item => item.id !== productId);
      }

      // Recalcular el total
      this.calculateTotal();

      console.log(`Producto con ID ${productId} eliminado del carrito`);
    }
  }


  addToCart(product: Product) {
    const existingItem = this.carrito.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.carrito.push({ ...product, quantity: 1 });
    }
    this.calculateTotal();
  }



  confirmarVenta() {
    console.log('Venta confirmada:', this.carrito,"Total:",this.total);
  }


}
