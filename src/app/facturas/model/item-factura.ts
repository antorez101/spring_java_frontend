import { Producto } from './producto';
export class ItemFactura {

    itemFacturaId: number;
    cantidad: number = 1;
    producto: Producto;
    total: number;

    public calculaTotal(): number {
        return this.cantidad * this.producto.precio;
    }
}
