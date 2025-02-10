import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Obtener el token almacenado (por ejemplo, en sessionStorage o localStorage)
    const token = sessionStorage.getItem('token'); // O cualquier lugar donde guardes el token

    // Si el token existe, agregarlo a los encabezados
    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(cloned);
    }

    // Si no hay token, proceder sin modificar la solicitud
    return next.handle(req);
  }
}
