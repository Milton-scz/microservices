import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ProductSave } from 'src/app/model/ProductSave';
import { Product } from 'src/app/model/Product';
import { Category } from '../../../model/Category';

@Component({
  selector: 'app-ofertas',
  templateUrl: './ofertas.component.html',
  styleUrls: ['./ofertas.component.scss'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class OfertasComponent implements OnInit {
  successMessage: string = '';
  errorMessage: string = '';
  products: Product[] = [];
  productsOffers: Product[] = [];
  categories: Category[] = [];
  productForm: FormGroup;
  private modalRef: any;

  constructor(
    private productoService: ProductService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {
    this.productForm = this.fb.group({
      product: [null, Validators.required],  // Para seleccionar el producto
      descuento: [0, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadProductsOffers();
  }

  loadProducts(): void {
    this.productoService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data.filter((product: any) => product.offer === 0);
      },
      error: (error) => {
        console.error('Error al obtener productos', error);
      },
    });
  }

  loadProductsOffers(): void {
    this.productoService.getAllProducts().subscribe({
      next: (data) => {
        this.productsOffers = data.filter((product: any) => product.offer === 1);
      },
      error: (error) => {
        console.error('Error al obtener productos', error);
      },
    });
  }

  open(content: any) {
    this.resetForm();
    this.modalRef = this.modalService.open(content);
  }

  onProductChange() {
    const selectedProduct = this.productForm.value.product;
    if (selectedProduct) {
      // Si se selecciona un producto, actualizar los campos del formulario
      this.productForm.patchValue({
        descuento: selectedProduct.offer === 1 ? selectedProduct.descuento : 0,
      });
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const productData: ProductSave = {
        id: this.productForm.value.product.id,
        name: this.productForm.value.product.name,
        precio: this.productForm.value.product.precio,
        stock: this.productForm.value.product.stock,
        description: this.productForm.value.product.description,
        categoryId: this.productForm.value.product.categoryId,
        offer: 1, // Marcarlo como oferta
        descuento: this.productForm.value.descuento,
        image: this.productForm.value.product.image,
      };

      this.productoService.updateProduct(productData).subscribe(() => {
        this.successMessage = 'Producto actualizado correctamente';
        this.loadProducts();
        this.loadProductsOffers();
        this.closeModal();
      });
    } else {
      console.log('El formulario no es válido');
    }
  }

  resetForm(): void {
    this.productForm.reset();
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.close();
      this.modalRef = null;
    }
  }

   updateProduct(product: Product): void {
     product.offer = 0;
     product.descuento = 0;
    this.productoService.updateProduct(product).subscribe({
      next: () => {
        this.successMessage = 'Producto eliminado con éxito';
        this.loadProducts();
        this.loadProductsOffers();
      },
      error: (error) => {
        this.errorMessage = 'Error al eliminar producto';
        console.error('Error al eliminar producto:', error);
      },
    });
  }
}
