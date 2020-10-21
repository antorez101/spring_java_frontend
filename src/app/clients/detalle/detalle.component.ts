import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from '../cliente';
import { ActivatedRoute } from '@angular/router';
import { ClientsService } from '../clients.service';
import swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';
import { AuthService } from 'src/app/usuarios/auth.service';
import { FacturaService } from '../../facturas/factura.service';
import { Factura } from '../../facturas/model/factura';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() cliente: Cliente;
  titulo = 'Detalle cliente';
  progress = 0;
  pictureSelected: File;


  constructor(private activedRoute: ActivatedRoute,
              private clientService: ClientsService,
              public modalService: ModalService,
              public authService: AuthService,
              private facturaService: FacturaService) { }

  ngOnInit(): void {
    /*console.log("Executing init ...")
    this.activedRoute.paramMap.subscribe(params => {
      let idCliente: any = params.get('idcliente');
      console.log("Idcliente "+idCliente);
      if (idCliente){        
        this.clientService.getClient(idCliente).subscribe(response =>{
          this.cliente = response;
        });      
      }
    });*/
  }


  selectPicture(event: any){
    this.progress = 0;
    this.pictureSelected = event.target.files[0];
    console.log('Picture selected ' + this.pictureSelected);
    if (this.pictureSelected.type.indexOf('image') < 0){
      swal.fire('Error: ', 'The file selected is not a picture', 'error');
      this.pictureSelected = null;
    }
  }

  uploadPicture(){
    console.log('Cliente id: ' + this.cliente.id);
    if (!this.pictureSelected){
      swal.fire('Error uploading picture', 'Select a picture to upload', 'error');
    } else {
      this.clientService.uploadPicture(this.pictureSelected, this.cliente.id).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress){
          this.progress = Math.round((event.loaded / event.total) * 100);
        } else if (event.type === HttpEventType.Response){
          let response: any = event.body;
          this.cliente = response.client as Cliente;
          console.log('Clente values ' + this.cliente);
          this.pictureSelected = null;
          this.modalService.uploadImage.emit(this.cliente);
          swal.fire('Picture uploaded', response.mensaje, 'success');
        }
      });
    }
  }

  closeModal(){
    console.log('Close modal');
    this.modalService.closeModal();
    this.pictureSelected = null;
    this.progress = 0;
  }

  deleteFactura(factura: Factura): void {
    swal.fire({
    title: 'Are you sure?',
    text: 'You wont be able to revert this!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.value) {
      this.facturaService.deleteFactura(factura.idFactura).subscribe(
        () => {
          this.cliente.facturas = this.cliente.facturas.filter(fact => fact !== factura);
          swal.fire(
            'Deleted!',
            `El cliente ${factura.idFactura} ha sido eliminado`,
            'success'
          );
        }
      );
    }
  });
  }

}
