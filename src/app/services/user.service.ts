import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiGateWay } from '../config/apiGategay';

import { UserSave } from '../model/UserSave';
import { UserUpdate } from '../model/UserUpdate';
import { Permission } from '../model/Permission';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = apiGateWay.url + '/user';

  constructor(private http: HttpClient) { }

  // Obtener todos los usuarios
  getAllUsers(): Observable<any> { const headers = new HttpHeaders({ 'Content-Type': 'application/json' }); return this.http.get<any>(this.baseUrl + "/getAll", { headers, withCredentials: true }) .pipe(catchError(this.handleError)); }
  // Crear un nuevo usuario
  createUser(user: UserSave): Observable<any> {  const headers = new HttpHeaders({ 'Content-Type': 'application/json' }); return this.http.post<any>(this.baseUrl + "/save", user, { headers, withCredentials: true })  .pipe(catchError(this.handleError));}
  // Actualizar un usuario existente
  updateUser( user: any): Observable<any> { const headers = new HttpHeaders({ 'Content-Type': 'application/json' }); return this.http.put<any>(`${this.baseUrl}/update`, user, { headers, withCredentials: true }) .pipe(catchError(this.handleError)); }
  // Eliminar un usuario
  deleteUser(userId: string): Observable<any> {    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });  return this.http.delete<any>(`${this.baseUrl}/deleteUserById/${userId}`, { headers, withCredentials: true }) .pipe(catchError(this.handleError)); }
  getAllRoles(): Observable<any> { const headers = new HttpHeaders({ 'Content-Type': 'application/json' });  return this.http.get<any>(this.baseUrl + "/role/getAll", { headers, withCredentials: true })  .pipe(catchError(this.handleError)); }
  createRol(role: any): Observable<any> {  const headers = new HttpHeaders({ 'Content-Type': 'application/json' }); return this.http.post<any>(this.baseUrl + "/role/save", role, { headers, withCredentials: true })   .pipe(catchError(this.handleError)); }
  // Actualizar un usuario existente
  updateRole( role: any): Observable<any> {  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });   return this.http.put<any>(`${this.baseUrl}/role/update`, role, { headers, withCredentials: true })  .pipe(catchError(this.handleError));}
  // Eliminar un usuario
  deleteRole(roleId: string): Observable<any> { const headers = new HttpHeaders({ 'Content-Type': 'application/json' }); return this.http.delete<any>(`${this.baseUrl}/deleteRoleById/${roleId}`, { headers, withCredentials: true })   .pipe(catchError(this.handleError));}
  assignPermissionToRole(roleId: string, permissionId:string): Observable<any> {  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });  return this.http.post<any>(`${this.baseUrl}/role/assignPermission/${roleId}/${permissionId}`, { headers, withCredentials: true })  .pipe(catchError(this.handleError)); }
// Obtener todos los permisos
deletePermissionToRole(roleId: string, permissionId:string): Observable<any> {  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });  return this.http.delete<any>(`${this.baseUrl}/role/removePermission/${roleId}/${permissionId}`, { headers, withCredentials: true })  .pipe(catchError(this.handleError)); }


// Obtener permisos de un rol
getPermissionsByRoleName(roleName: string): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/role/getPermissionsByRoleName/${roleName}`)
    .pipe(catchError(this.handleError));
}

// Actualizar permisos del rol
updateRolePermissions(data: any): Observable<any> {
  return this.http.put<any>(`${this.baseUrl}/role/updateRolePermissions`, data)
    .pipe(catchError(this.handleError));
}



  getAllPermissions(): Observable<any> {  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });   return this.http.get<any>(this.baseUrl + "/permission/getAll", { headers, withCredentials: true })     .pipe(catchError(this.handleError)); }

  createPermission(permission: any): Observable<any> {  const headers = new HttpHeaders({ 'Content-Type': 'application/json' }); return this.http.post<any>(this.baseUrl + "/permission/save", permission, { headers, withCredentials: true })    .pipe(catchError(this.handleError)); }

  // Actualizar un permiso existente
  updatePermission(permission: any): Observable<any> {   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });    return this.http.put<any>(`${this.baseUrl}/permission/update`, permission, { headers, withCredentials: true })    .pipe(catchError(this.handleError));}

  // Eliminar un permiso
  deletePermission(permissionId: string): Observable<any> {  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });  return this.http.delete<any>(`${this.baseUrl}/deletePermissionById/${permissionId}`, { headers, withCredentials: true })    .pipe(catchError(this.handleError));}




  // Manejo de errores
  private handleError(error: HttpErrorResponse) {  let errorMessage = 'Ocurrió un error desconocido'; if (error.error instanceof ErrorEvent) {   errorMessage = `Error: ${error.error.message}`; } else {  errorMessage = `Código de error: ${error.status}, Mensaje: ${error.message}`; } console.error(errorMessage); return throwError(() => new Error(errorMessage));}
}
