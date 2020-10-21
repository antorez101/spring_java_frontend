import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from './usuario';



@Injectable({
  providedIn: 'root'
})
export class AuthService {


  _token: string;
  _usuario: Usuario;
  
  
  constructor(private http: HttpClient) { }

  login(usuario: Usuario): Observable<any>{
    console.log("En serviceAuth ...");
    const urlAuth = 'http://localhost:8080/oauth/token';
    const credenciales = btoa('angularapp'+':'+'12345');
    const httpHeaders = new HttpHeaders({
      'Content-Type':'application/x-www-form-urlencoded',
      'Authorization':'Basic '+credenciales
    });
    let parameters = new URLSearchParams();
    parameters.set('grant_type', 'password');
    parameters.set('username', usuario.username);
    parameters.set('password', usuario.password);
    console.log(parameters.toString());
    return this.http.post<any>(urlAuth, parameters.toString(), {headers: httpHeaders});
    
  }

  guardaToken(token: string): void {

    this._token = token;
    sessionStorage.setItem('token', this._token);
    
  }

  get token(): string{
    if (this._token != null){
      return this._token;
    }else if (this._token == null && sessionStorage.getItem('token') != null){
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }

  public isAuthenticated(): boolean{
    if (this.token != null){
      return true;
    }
    return false;
    }

    public logout(): void {
      this._token = null;
      sessionStorage.removeItem('token');
    }

    public hasRole(role: string): boolean{
      if (this.usuario != null && this.usuario.roles.includes(role)){
        return true;
      }
      return false;

    }

    guardarUsuario(accessToken: string): void{
      let payload = this.obtenerDatosAccesToken(accessToken);
      this._usuario = new Usuario();
      if (payload != null) {
        this._usuario.username = payload.user_name;
        this._usuario.roles = payload.authorities;
      }
      sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
    }

    obtenerDatosAccesToken(accessToken: string): any {
      if (accessToken != null) {
        return JSON.parse(atob(accessToken.split('.')[1]));
      }
      return null;
    }

    get usuario(): Usuario{
      if(this._usuario != null){
        return this._usuario;
      } else if (this._usuario == null && sessionStorage.getItem('usuario') != null){
        this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
        return this._usuario;
      }
      return null;
    }
}
