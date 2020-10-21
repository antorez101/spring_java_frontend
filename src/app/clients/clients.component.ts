import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from './cliente';
import { ClientsService } from  './clients.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { ModalService } from './detalle/modal.service';
import { map } from 'rxjs/operators';
import { AuthService } from '../usuarios/auth.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {

  clients: Cliente[];
  paginator: any;
  clienteSelected: Cliente;
  
 
  constructor(private clientsService: ClientsService, private router: Router,
     private activatedRoute: ActivatedRoute,
     private modalService: ModalService,
     public authService: AuthService) { }

  ngOnInit(){
    //this.loadClientes();
    this.activatedRoute.params.subscribe(param => {
      let page: number = param['page'];
      if (!page){
        page = 0;
      }
      this.clientsService.getClientesPageable(page).subscribe(response =>{
      this.clients = response.content as Cliente[];
      this.paginator = response;
    })
    });
    /*this.clientsService.getClients().subscribe(
      clientes => this.clients = clientes
      //Another way to set value to clients is using a function as follow
      function (clientes){
        this.client = clientes
      }
    );*/
    this.modalService.uploadImage.subscribe((cliente: any) => {
      this.clients = this.clients.map(clienteOriginal => {
        if (clienteOriginal.id == cliente.id){
          clienteOriginal.picture = cliente.picture;
        }
        return clienteOriginal;
      })
    })
    
  }

  loadClientes(): void {
    this.activatedRoute.params.subscribe(params => {
      let page: number = +params.get('page');
      if (!page){
        page = 0;
      }
      this.clientsService.getClientesPageable(page).subscribe(response => {
      this.clients = response.content as Cliente[];
      });
    });

  }

  deleteCliente(cliente: Cliente): void{    
      swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
          this.clientsService.deleteCliente(cliente).subscribe(
            response => {
              this.clients = this.clients.filter(cli => cli !== cliente)
              swal.fire(
                'Deleted!',
                `El cliente ${cliente.id} ha sido eliminado`,
                'success'
              )
            }
          )          
        }
      })    
  }

  loadCliente(id: any): void{
    this.clientsService.getClient(id).subscribe((response) => {
      this.router.navigate(['/formclient']);
      });
  }

  openModal(client: any){
      console.log('Open modal');
      if (client != null) {
        this.clienteSelected = client;
        this.modalService.openModal();
      }
  }

}
