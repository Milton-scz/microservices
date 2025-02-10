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

@Component({
  selector: 'app-categoria',
  templateUrl: './ajuste.component.html',
  styleUrls: ['./ajuste.component.scss'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class AjusteComponent implements OnInit {
  successMessage: string = '';
  errorMessage: string = '';
  products: Product[] = [];
  almacens: Almacen[] = [];
  ajustes: AjusteInventario[] = [];
  ajusteForm: FormGroup;

  private modalRef: NgbModalRef | null = null;

  constructor(private productService: ProductService, private fb: FormBuilder, private modalService: NgbModal) {
    this.ajusteForm = this.fb.group({
      productId: ['', Validators.required],
      almacenId: ['', Validators.required],
      tipo: ['', Validators.required],
      cantidad: ['', Validators.required],
      glosa: ['', Validators.required],
    });
  }

  open(ajusteModal: any): void {
    this.resetForm();
    this.modalRef = this.modalService.open(ajusteModal, { size: 'xl' });  // Guarda la referencia del modal
  }

  resetForm(): void {
    this.ajusteForm.reset(); // Resetea el formulario
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadAlmacens();
    this.loadAjustes();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        console.log(data);
        this.products = data;
      },
      error: (error) => {
        console.error('Error al obtener products', error);
      },
    });
  }

  loadAlmacens(): void {
    this.productService.getAllAlmacens().subscribe({
      next: (data) => {
        console.log("Alamcens:", data);
        this.almacens = data;
      },
      error: (error) => {
        console.error('Error al obtener almacens', error);
      },
    });
  }

  loadAjustes(): void {
    this.productService.getAllAjustes().subscribe({
      next: (data) => {
        console.log("ajustes:", data);
        this.ajustes = data;
      },
      error: (error) => {
        console.error('Error al obtener almacens', error);
      },
    });
  }

  onSubmit(): void {
    if (this.ajusteForm.valid) {
      const formValue = this.ajusteForm.value;

      const ajusteData: AjusteInventarioDto = {
        productId: formValue.productId,
        almacenId: formValue.almacenId,
        tipo: formValue.tipo,
        cantidad: formValue.cantidad,
        glosa: formValue.glosa
      };

      this.productService.createAjuste(ajusteData).subscribe({
        next: () => {
          this.successMessage = 'Ajuste creado correctamente';
          this.loadAjustes();
          this.loadAlmacens();
          this.loadProducts();
          this.closeModal(); // Cierra el modal después de enviar
        },
        error: (error) => {
          this.errorMessage = 'Error al crear ajuste';
          console.error('Error al crear ajuste', error);
        }
      });
    } else {
      console.log("El formulario no es válido");
    }
  }

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close(); // Cierra el modal
      this.modalRef = null;
    }
  }

  deleteAjuste(ajusteId: string): void {
    this.productService.deleteAjuste(ajusteId).subscribe({
      next: () => {
        this.successMessage = 'Ajuste eliminado con éxito';
        this.loadAjustes();
        this.loadAlmacens();
        this.loadProducts();
      },
      error: (error) => {
        this.errorMessage = 'Error al eliminar ajuste';
        console.error('Error al eliminar ajuste', error);
      },
    });
  }
}
