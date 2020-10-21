import { Component, OnInit } from '@angular/core';
import { Factura } from './model/factura';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from '../clients/cliente';
import { ClientsService } from '../clients/clients.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith, flatMap} from 'rxjs/operators';
import { Producto } from './model/producto';
import { FacturaService } from './factura.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ItemFactura } from './model/item-factura';
import swal from 'sweetalert2';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private clienteService: ClientsService,
              private facturaService: FacturaService, private router: Router) { }

  titulo = 'Nueva factura';
  factura =  new Factura();
  cliente = Cliente;

  autoCompleteControl = new FormControl();
  productos: Producto[];
  filteredProductos: Observable<Producto[]>;


  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let idCliente = params.get('idCliente');
      this.clienteService.getClient(idCliente).subscribe(cliente => {
        this.factura.cliente = cliente;
      });
    });

    this.filteredProductos = this.autoCompleteControl.valueChanges.pipe(
      map(value => typeof value === 'string' ? value : value.description),
      flatMap(value => value ? this._filter(value) : [])
    );
  }

  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();

    return this.facturaService.findProductoByName(filterValue);
  }

  showProductoName(producto?: Producto): string | undefined{
    return producto ? producto.description : undefined;
  }

  productSelected(event: MatAutocompleteSelectedEvent){

    let producto = event.option.value as Producto;
    console.log('producto ' + producto.precio);
    if (this.existeProducto(producto.productoId)){
      this.incrementaCantidad(producto.productoId);
    } else {
      let newItem = new ItemFactura();
      newItem.producto = producto;
      this.factura.itemFacturas.push(newItem);
    }
    // Clean autocomplete and set it in empty
    this.autoCompleteControl.setValue('');
    // remove focus from autocomplete event and reset it
    event.option.focus();
    // and also remove the item select to be able to select another
    event.option.deselect();

  }

  updateCantidad(productoId: number, event): void {
    let cantidad = event.target.value as number;
    if (cantidad == 0) {
      return this.deleteItem(productoId);
    }
    console.log(productoId);
    console.log(cantidad);
    this.factura.itemFacturas = this.factura.itemFacturas.map((item: ItemFactura) => {
      if (productoId === item.producto.productoId) {
        item.cantidad = cantidad;
      }
      return item;
    });
  }

  existeProducto(productoId: number): boolean {
    let existe = false;
    this.factura.itemFacturas.forEach((item: ItemFactura) => {
      if (productoId === item.producto.productoId) {
        existe = true;
      }
    });
    return existe;
  }

  incrementaCantidad(idProducto: number): void {
    this.factura.itemFacturas.map((item: ItemFactura) => {
      if ( idProducto === item.producto.productoId ) {
          ++item.cantidad;
      }
      return item;
    });
  }

  deleteItem(productoId: number): void{
    this.factura.itemFacturas = this.factura.itemFacturas.filter((item: ItemFactura) => item.producto.productoId !== productoId);
  }

  saveFactura(): void {
    console.log('Saving factura ' + this.factura)
    this.facturaService.saveFactura(this.factura).subscribe(response => {
      swal.fire('Factura creada', 'La factura fue creada exitosament', 'success');
      this.router.navigate(['/clients']);
    });
  }

}
