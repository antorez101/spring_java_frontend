import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService, private router: Router){}

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
        
    return next.handle(req).pipe(
      catchError((error: any) =>{

        if (error.status === 401){
          if(this.authService.isAuthenticated()){
            this.authService.logout();
          }
          
          this.router.navigate(['/login']);
          
        }
        if (error.status === 403){
          swal.fire("Warning!", "Insuficientes permisos", "info");
          this.router.navigate(['/clients']);
          
        }
        
        return throwError(error);
        
      })
    );
  }
}
