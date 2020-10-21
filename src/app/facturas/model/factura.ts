import { Cliente } from '../../clients/cliente';
import { ItemFactura } from './item-factura';
export class Factura {

    idFactura: number;
    description: string;
    observation: string;
    createAt: Date;
    cliente: Cliente;
    itemFacturas: Array<ItemFactura> = [];
    total: number;

    calcularTotal(): number {
        this.total = 0;
        this.itemFacturas.forEach((item: ItemFactura) => {
            this.total += item.calculaTotal();
            console.log(this.total);
        });
        return this.total;
    }
}
