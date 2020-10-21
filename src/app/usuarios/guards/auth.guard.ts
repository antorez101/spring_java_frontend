import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authServ: AuthService, private router: Router){

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.authServ.isAuthenticated()){
        if (this.isTokenExpired()){
          this.authServ.logout();
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      }
      this.router.navigate(['/login']);
    return false;
  }

  isTokenExpired(): boolean{
    let token = this.authServ.token;
    let payload = this.authServ.obtenerDatosAccesToken(token);
    let time = new Date().getTime() / 1000;
    if (payload.exp < time){
      return true;
    }
    return false;
  }
  
}
