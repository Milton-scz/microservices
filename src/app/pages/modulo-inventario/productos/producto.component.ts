import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/model/User';
import { ProductService } from 'src/app/services/product.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ProductSave } from 'src/app/model/ProductSave';
import { Product } from 'src/app/model/Product';
import { Category } from '../../../model/Category';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class ProductoComponent implements OnInit {
  successMessage: string = '';
  errorMessage: string = '';
  products: Product[] = [];
  categories: Category[] = [];
  productForm: FormGroup;
  currentProduct: Product | null = null;
  private modalRef: NgbModalRef | null = null; // Referencia al modal
  selectedFile: File | null = null; // Para manejar el archivo de imagen
  response: { almacen: string; stock: number }[] = [];
  constructor(
    private productoService: ProductService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      stock: null,
      precio: [0, Validators.required],
      category: [1, Validators.required],
      image: ['', Validators.required], // No usamos este campo en el formulario
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  open(ajusteModal: any): void {
    this.resetForm();
    this.modalRef = this.modalService.open(ajusteModal, { size: 'xl' });  // Guarda la referencia del modal
  }

  editProduct(product: Product, content: any): void {
    this.modalRef = this.modalService.open(content, { size: 'xl' });
    this.currentProduct = product;
    console.log(this.currentProduct);
    this.productForm.patchValue({
      id: product.id,
      name: product.name,
      description: product.description,
      stock: Number(product.stock),
    precio: Number(product.precio),
      category: product.category.id,
      image:product.image
    });
    this.selectedFile = product.image ? new File([], product.image) : null; // Asignamos la imagen si existe
    this.modalRef = this.modalService.open(content);
  }

  verStockProduct(product: Product, content: any): void {
    this.currentProduct = product;
    console.log("Producto seleccionado:", this.currentProduct);

    // Limpiar la respuesta anterior
    this.response = [];

    this.productoService.getStockProduct(product.id).subscribe({
      next: (data) => {
        // Convertimos la respuesta en un array de objetos { almacen, stock }
        this.response = Object.entries(data).map(([almacen, stock]) => ({
          almacen,
          stock: Number(stock), // Convertir stock a número
        }));

        console.log("Stock del producto:", this.response);

        // Solo abrimos el modal si hay datos disponibles
        if (this.response.length > 0) {
          this.modalRef = this.modalService.open(content, { size: 'lg' });
        } else {
          console.warn("No hay stock disponible para este producto.");
        }
      },
      error: (error) => {
        this.errorMessage = 'Error al obtener stock del producto';
        console.error('Error al obtener stock del producto:', error);
      },
    });
  }




  loadCategories(): void {
    this.productoService.getAllCategories().subscribe(
      (categories) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Error al obtener categorías:', error);
      }
    );
  }

  loadProducts(): void {
    this.productoService.getAllProducts().subscribe({
      next: (data) => {
        console.log(data);
        this.products = data;
      },
      error: (error) => {
        console.error('Error al obtener productos', error);
      },
    });
  }



  onFileChange(event: any): void {
    const file = event.target.files[0]; // Obtener el archivo seleccionado
    if (file) {
      this.selectedFile = file;  // Guardar el archivo en la propiedad selectedFile
      const reader = new FileReader();

      // Convertir el archivo a Base64
      reader.onload = () => {
        // Aquí guardamos la cadena Base64
        const base64String = reader.result as string;
        // Asignamos la cadena Base64 al campo de imagen del formulario
        this.productForm.patchValue({
          image: base64String
        });
      };

      // Leer el archivo como una URL de datos (Base64)
      reader.readAsDataURL(file);
    }
  }


  onSubmit(): void {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      const isEditing = !!this.currentProduct;
      const productData: ProductSave = {
        name: formValue.name,
        description: formValue.description,
        stock: formValue.stock,
        precio: formValue.precio,
        categoryId: formValue.category,
        image: formValue?.image,
      };

      if (isEditing) {
        productData.id = this.currentProduct.id;
      }

      if (isEditing) {
        console.log("Editando:", productData);
        this.productoService.updateProduct(productData).subscribe(() => {
          this.successMessage = 'Producto actualizado correctamente';
          this.loadProducts();
          this.closeModal();
          this.resetForm(); // Limpiar formulario
        });
      } else {
        console.log("Creando:", productData);
        this.productoService.createProduct(productData).subscribe(() => {
          this.successMessage = 'Producto creado correctamente';
          this.loadProducts();
          this.closeModal();
          this.resetForm(); // Limpiar formulario
        });
      }
    } else {
      console.log("El formulario no es válido");
    }
  }

  // Función para resetear el formulario
  resetForm(): void {
    this.productForm.reset();
    this.selectedFile = null; // Limpiamos también el archivo seleccionado
    this.currentProduct = null; // Limpiamos el producto actual
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.close();
      this.modalRef = null;
    }
  }

  deleteProduct(productId: string): void {
    this.productoService.deleteProduct(productId).subscribe({
      next: () => {
        this.successMessage = 'Producto eliminado con éxito';
        this.loadProducts();
      },
      error: (error) => {
        this.errorMessage = 'Error al eliminar producto';
        console.error('Error al eliminar producto:', error);
      },
    });
  }
}
