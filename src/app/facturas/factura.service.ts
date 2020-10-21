import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, pipe } from 'rxjs';
import { Factura } from './model/factura';
import { AuthService } from '../usuarios/auth.service';
import { Producto } from './model/producto';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  constructor(private http: HttpClient) { }

  private urlFacturasEndPoint = 'http://localhost:8080/api/facturas';


  public findFactura(id: number): Observable<any> {

    return this.http.get<any>(`${this.urlFacturasEndPoint}/${id}`);
  }

  public deleteFactura(id: number): Observable<void>{
    return this.http.delete<void>(`${this.urlFacturasEndPoint}/${id}`);
  }

  public findProductoByName(name: string): Observable<Producto[]>{
    return this.http.get<Producto[]>(`${this.urlFacturasEndPoint}/productos/${name}`);
  }

  public saveFactura(factura: Factura): Observable<Factura>{
    return this.http.post<Factura>(this.urlFacturasEndPoint, factura);
  }

}
