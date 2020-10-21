import { Identifiers } from '@angular/compiler';
import { Region } from './region';
import { Factura } from '../facturas/model/factura';

export class Cliente {

    id: number;
    clientName: string;
    lastName: string;
    email: string;
    createdAt: string;
    picture: string;
    region: Region;
    facturas: Array<Factura> = [];
}
