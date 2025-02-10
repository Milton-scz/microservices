import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiGateWay } from '../config/apiGategay';
import { Category } from 'src/app/model/Category';  // Asumiendo que tienes un modelo Category
import { Product } from '../model/Product';
import { ProductSave } from '../model/ProductSave';
import { Almacen } from '../model/Almacen';
import { AjusteInventario } from '../model/AjusteInventario';
import { AjusteInventarioDto } from '../model/AjusteInventarioDto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = apiGateWay.url + '/product-service';

  constructor(private http: HttpClient) { }

  //  CATEGORY
  getAllCategories(): Observable<Category[]> { const headers = new HttpHeaders({ 'Content-Type': 'application/json' }); return this.http.get<Category[]>(this.baseUrl + "/category/getAll", { headers, withCredentials: true })   .pipe(catchError(this.handleError));}
  createCategory(category: Category): Observable<Category> { const headers = new HttpHeaders({ 'Content-Type': 'application/json' }); return this.http.post<Category>(this.baseUrl + "/category/create", category, { headers, withCredentials: true }) .pipe(catchError(this.handleError));}
  updateCategory(category: Category): Observable<Category> { const headers = new HttpHeaders({ 'Content-Type': 'application/json' });  return this.http.put<Category>(`${this.baseUrl}/category/update`, category, { headers, withCredentials: true })  .pipe(catchError(this.handleError)); }
  deleteCategory(categoryId: string): Observable<any> { const headers = new HttpHeaders({ 'Content-Type': 'application/json' });  return this.http.delete<any>(`${this.baseUrl}/category/deleteCategoryById/${categoryId}`, { headers, withCredentials: true }) .pipe(catchError(this.handleError)); }

  //  PRODUCT
  getAllProducts(): Observable<Product[]> { const headers = new HttpHeaders({ 'Content-Type': 'application/json' }); return this.http.get<Product[]>(this.baseUrl + "/product/getAll", { headers, withCredentials: true })   .pipe(catchError(this.handleError));}
  createProduct(product: ProductSave): Observable<Product> { const headers = new HttpHeaders({ 'Content-Type': 'application/json' }); return this.http.post<Product>(this.baseUrl + "/product/create", product, { headers, withCredentials: true }) .pipe(catchError(this.handleError));}
  updateProduct(product: ProductSave): Observable<Product> { const headers = new HttpHeaders({ 'Content-Type': 'application/json' });  return this.http.put<Product>(`${this.baseUrl}/product/update`, product, { headers, withCredentials: true })  .pipe(catchError(this.handleError)); }
  deleteProduct(productId: string): Observable<any> { const headers = new HttpHeaders({ 'Content-Type': 'application/json' });  return this.http.delete<any>(`${this.baseUrl}/product/deleteProductById/${productId}`, { headers, withCredentials: true }) .pipe(catchError(this.handleError)); }
  getStockProduct(productId: string): Observable<any> { const headers = new HttpHeaders({ 'Content-Type': 'application/json' });  return this.http.get<any>(`${this.baseUrl}/product/getStockByProductId/${productId}`, { headers, withCredentials: true })   .pipe(catchError(this.handleError));}

   //  CATEGORY
   getAllAlmacens(): Observable<Almacen[]> { const headers = new HttpHeaders({ 'Content-Type': 'application/json' }); return this.http.get<Almacen[]>(this.baseUrl + "/almacen/getAll", { headers, withCredentials: true })   .pipe(catchError(this.handleError));}
   createAlmacen(almacen: Almacen): Observable<Almacen> { const headers = new HttpHeaders({ 'Content-Type': 'application/json' }); return this.http.post<Almacen>(this.baseUrl + "/almacen/create", almacen, { headers, withCredentials: true }) .pipe(catchError(this.handleError));}
   updateAlmacen(almacen: Almacen): Observable<Almacen> { const headers = new HttpHeaders({ 'Content-Type': 'application/json' });  return this.http.put<Almacen>(`${this.baseUrl}/almacen/update`, almacen, { headers, withCredentials: true })  .pipe(catchError(this.handleError)); }
   deleteAlmacen(almacenId: string): Observable<any> { const headers = new HttpHeaders({ 'Content-Type': 'application/json' });  return this.http.delete<any>(`${this.baseUrl}/almacen/deleteAlmacenById/${almacenId}`, { headers, withCredentials: true }) .pipe(catchError(this.handleError)); }

   //  AJUSTE INVENTARIO
   getAllAjustes(): Observable<AjusteInventario[]> { const headers = new HttpHeaders({ 'Content-Type': 'application/json' }); return this.http.get<AjusteInventario[]>(this.baseUrl + "/ajusteInventario/getAll", { headers, withCredentials: true })   .pipe(catchError(this.handleError));}
   createAjuste(ajuste: AjusteInventarioDto): Observable<AjusteInventario> { const headers = new HttpHeaders({ 'Content-Type': 'application/json' }); return this.http.post<AjusteInventario>(this.baseUrl + "/ajusteInventario/create", ajuste, { headers, withCredentials: true }) .pipe(catchError(this.handleError));}
   updateAjuste(ajuste: AjusteInventario): Observable<AjusteInventario> { const headers = new HttpHeaders({ 'Content-Type': 'application/json' });  return this.http.put<AjusteInventario>(`${this.baseUrl}/ajusteInventario/update`, ajuste, { headers, withCredentials: true })  .pipe(catchError(this.handleError)); }
   deleteAjuste(ajusteId: string): Observable<any> { const headers = new HttpHeaders({ 'Content-Type': 'application/json' });  return this.http.delete<any>(`${this.baseUrl}/ajusteInventario/deleteAjusteInventarioById/${ajusteId}`, { headers, withCredentials: true }) .pipe(catchError(this.handleError)); }



  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
   let errorMessage = 'Ocurrió un error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}, Mensaje: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
