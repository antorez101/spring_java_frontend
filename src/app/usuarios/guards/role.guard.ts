import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authServ: AuthService, private router: Router){

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      if (!this.authServ.isAuthenticated()){
        this.router.navigate(['/login']);
        return false;
      }
      let role = next.data['role'] as string;
      if (this.authServ.hasRole(role)){
        return true;
      }
      Swal.fire("Not allowed", "Insuficientes permisos", "info");
      this.router.navigate(['/clients']);
    return false;
  }
  
}
