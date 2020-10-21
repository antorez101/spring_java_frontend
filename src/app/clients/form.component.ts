import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClientsService } from './clients.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Region } from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  cliente: Cliente = new Cliente();
  titulo: String = "Crear cliente";
  errores: String[];
  regiones: Region[];
  constructor(private clienteService: ClientsService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadCliente();
    this.loadRegiones();
  }

  create(): void{
    console.log("clicked");
    console.log(this.cliente);
    this.clienteService.createCliente(this.cliente)
    .subscribe(
      cliente => { 
        this.router.navigate(['/clients'])
        swal.fire('Cliente added', `Cliente ${cliente.clientName} creado con exito`, 'success')
    },
    err => {      
      this.errores = err.error.errors as String[];
      console.error('Código de error '+err.status);
      console.error(err.error.errors);
    }
    );    
  }


  loadCliente(): void{
    this.activatedRoute.params.subscribe(param => {
      let idParam = param['idcliente'];
      if (idParam){
        console.log(idParam);
        this.clienteService.getClient(idParam).subscribe(response => {
        console.log(response.id)
        console.log(response.lastName)
        this.cliente = response})
      }
      
    })
  }

  
  updateClient(): void{
    this.cliente.facturas = null;
    this.clienteService.updateCliente(this.cliente).subscribe((cliente) => {
        this.router.navigate(['/clients'])
        swal.fire("Cliente updated", `El cliente ${cliente.clientName} se actualizo con exito`, "success")
      },
      err => {      
        this.errores = err.error.errors as String[];
        console.error('Código de error '+err.status);
        console.error(err.error.errors);
      })
  }

  loadRegiones(): void{
    this.clienteService.getRegiones().subscribe(regiones => this.regiones = regiones);
  }

  compareRegion(region1: Region, region2: Region): boolean{
    if (region1 === undefined && region2 === undefined){
      return true;
    }
    return region1 === null || region2 === null || region1 === undefined || region2 === undefined? false : region1.id === region2.id;
  }
}
