import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { Category } from 'src/app/model/Category';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class CategoriaComponent implements OnInit {
  successMessage: string = '';
  errorMessage: string = '';
  categories: Category[] = [];
  categoryForm: FormGroup;
  currentCategory: Category | null = null;
  private modalRef: NgbModalRef | null = null; // Referencia al modal

  constructor(private categoryService: ProductService, private fb: FormBuilder, private modalService: NgbModal) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  open(content: any) {
    this.modalRef = this.modalService.open(content);
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  editCategory(category: Category, content: any): void {
    this.currentCategory = category;

    this.categoryForm.patchValue({
      id: category.id,
      name: category.name,
      description: category.description,
    });
    this.modalRef = this.modalService.open(content);
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        console.log(data);
        this.categories = data;
      },
      error: (error) => {
        console.error('Error al obtener categorías', error);
      },
    });
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const formValue = this.categoryForm.value;
      const isEditing = !!this.currentCategory;

      const categoryData: Category = {
        id: formValue.id,
        name: formValue.name,
        description: formValue.description,
      };

      if (isEditing) {
        const categoryDataUpdate: Category = {
          id: this.currentCategory.id,
          name: formValue.name,
          description: formValue.description,
        };

        console.log("Editando categoría:", categoryDataUpdate);
        this.categoryService.updateCategory(categoryDataUpdate).subscribe(() => {
          this.successMessage = 'Categoría actualizada correctamente';
          this.loadCategories();
          this.closeModal(); // Cierra el modal después de editar
        });
      } else {
        console.log("Creando categoría:", categoryData);
        this.categoryService.createCategory(categoryData).subscribe(() => {
          this.successMessage = 'Categoría creada correctamente';
          this.loadCategories();
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

  deleteCategory(categoryId: string): void {
    this.categoryService.deleteCategory(categoryId).subscribe({
      next: () => {
        this.successMessage = 'Categoría eliminada con éxito';
        this.loadCategories();  // Recargar la lista de categorías
      },
      error: (error) => {
        this.errorMessage = 'Error al eliminar categoría';
        console.error('Error al eliminar categoría', error);
      },
    });
  }
}
