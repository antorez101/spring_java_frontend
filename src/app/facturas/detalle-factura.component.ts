import { Component, OnInit } from '@angular/core';
import { FacturaService } from './factura.service';
import { Factura } from './model/factura';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-detalle-factura',
  templateUrl: './detalle-factura.component.html',
  styleUrls: ['./detalle-factura.component.css']
})
export class DetalleFacturaComponent implements OnInit {

  constructor(private facturaService: FacturaService, private activatedRoute: ActivatedRoute) { }

  factura: Factura;

  titulo = 'Detalle factura';

  ngOnInit(): void {
    this.findFactura();

  }

  findFactura(): void{
    this.activatedRoute.paramMap.subscribe(params => {
      let id = +params.get('idFactura');
      console.log('id factUra ' + id);
      // tslint:disable-next-line: deprecation
      this.facturaService.findFactura(id).subscribe(response =>
          this.factura = response
        );
    });
  }

}
