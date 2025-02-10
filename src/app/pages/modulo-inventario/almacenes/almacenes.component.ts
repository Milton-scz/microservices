import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service'; // Cambié el servicio a AlmacenService
import { Almacen } from 'src/app/model/Almacen'; // Cambié la importación de Category a Almacen
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-almacenes',
  templateUrl: './almacenes.component.html',
  styleUrls: ['./almacenes.component.scss'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class AlmacenComponent implements OnInit {
  successMessage: string = '';
  errorMessage: string = '';
  almacenes: Almacen[] = []; // Cambié la variable de categories a almacenes
  almacenForm: FormGroup; // Cambié el nombre del formulario a almacenForm
  currentAlmacen: Almacen | null = null;
  private modalRef: NgbModalRef | null = null; // Referencia al modal

  constructor(private productService: ProductService, private fb: FormBuilder, private modalService: NgbModal) {
    this.almacenForm = this.fb.group({
      name: ['', Validators.required],
      descripcion: ['', Validators.required],
      capacidad: ['', [Validators.required, Validators.min(1)]], // Agregué capacidad como un campo obligatorio
    });
  }

  open(content: any) {
    this.modalRef = this.modalService.open(content);
  }

  ngOnInit(): void {
    this.loadAlmacenes(); // Llamé a loadAlmacenes en lugar de loadCategories
  }

  editAlmacen(almacen: Almacen, content: any): void {
    this.currentAlmacen = almacen;

    this.almacenForm.patchValue({
      id: almacen.id,
      name: almacen.name,
      descripcion: almacen.descripcion,
      capacidad: almacen.capacidad, // Agregué capacidad al formulario
    });
    this.modalRef = this.modalService.open(content);
  }

  loadAlmacenes(): void {
    this.productService.getAllAlmacens().subscribe({
      next: (data) => {
        console.log(data);
        this.almacenes = data;
      },
      error: (error) => {
        console.error('Error al obtener almacenes', error);
      },
    });
  }

  onSubmit(): void {
    if (this.almacenForm.valid) {
      const formValue = this.almacenForm.value;
      const isEditing = !!this.currentAlmacen;

      const almacenData: Almacen = {
        id: formValue.id,
        name: formValue.name,
        descripcion: formValue.descripcion,
        capacidad: formValue.capacidad, // Tomando capacidad del formulario
      };

      if (isEditing) {
        const almacenDataUpdate: Almacen = {
          id: this.currentAlmacen.id,
          name: formValue.name,
          descripcion: formValue.descripcion,
          capacidad: formValue.capacidad, // Agregué capacidad en la actualización
        };

        console.log("Editando almacén:", almacenDataUpdate);
        this.productService.updateAlmacen(almacenDataUpdate).subscribe(() => {
          this.successMessage = 'Almacén actualizado correctamente';
          this.loadAlmacenes(); // Recarga la lista de almacenes
          this.closeModal(); // Cierra el modal después de editar
        });
      } else {
        console.log("Creando almacén:", almacenData);
        this.productService.createAlmacen(almacenData).subscribe(() => {
          this.successMessage = 'Almacén creado correctamente';
          this.loadAlmacenes(); // Recarga la lista de almacenes
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

  deleteAlmacen(almacenId: string): void {
    this.productService.deleteAlmacen(almacenId).subscribe({
      next: () => {
        this.successMessage = 'Almacén eliminado con éxito';
        this.loadAlmacenes();  // Recargar la lista de almacenes
      },
      error: (error) => {
        this.errorMessage = 'Error al eliminar almacén';
        console.error('Error al eliminar almacén', error);
      },
    });
  }
}
