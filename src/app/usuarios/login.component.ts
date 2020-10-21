import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  title: string = "Login form";
  usuario: Usuario;

  constructor(private authService: AuthService, private router: Router) { 
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()){
      swal.fire("Usuario authenticado", "Ya se encuentra authenticado", "info");
      this.router.navigate(['/clients']);
      
    }
  }

  login(): void{
    
    console.log(this.usuario);
    if (this.usuario.username == null || this.usuario.password == null){
      swal.fire("Error", "El usuario o contraseña estan vacios", "error");
      return;
    }  
    this.authService.login(this.usuario).subscribe(response => {
      console.log(response);
      let payload = JSON.parse(atob(response.access_token.split('.')[1]));
      console.log(payload);
      this.router.navigate(['/clients']);
      console.log("access Token: "+response.access_token);

      this.authService.guardaToken(response.access_token);
      this.authService.guardarUsuario(response.access_token);
      swal.fire("Login exitoso", `Hola, has iniciado sesion exitosament`, "success");
    },
      error => {
        console.log("Error status "+error.status);
        if (error.status == 400){
          swal.fire("Credenciales invalidas", "Las credenciales ingresadas son invalidas", "error");
        }
      }
    )
  }

}
