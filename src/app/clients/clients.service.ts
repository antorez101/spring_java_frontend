import { Injectable } from '@angular/core';
import { formatDate, DatePipe } from '@angular/common';
import { Cliente} from './cliente';
import { Observable, throwError } from 'rxjs';
import { of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Region } from './region';
import { AuthService } from '../usuarios/auth.service';

@Injectable()
export class ClientsService {

  private urlEndpointClientes = 'http://localhost:8080/api/clientes';

  // These headers are not more used since is used the AuthInterceptor
  httpHeaders  = new HttpHeaders({'Content-Type': 'application/json'});



  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  // This method is used to add the access_token to the request headers
  // Is replaced with the AuthInterceptor, this intercept the request and add the access_token
  private addAccessTokenToHeaders() {

    const token = this.authService.token;
    console.log('Token acces for headers ' + token);
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  // This method is not more used since we used the ErrorInterceptor
  public validateauthorities(e: any): boolean {
    if (e.status === 401) {
      if (this.authService.isAuthenticated()) {
        this.authService.logout();
      }

      this.router.navigate(['/login']);
      return true;
    }
    if (e.status === 403) {
      swal.fire('Warning!', 'Insuficientes permisos', 'info');
      this.router.navigate(['/clients']);
      return false;
    }
    return false;
  }

  getClientesPageable(page: number): Observable<any> {
    return this.http.get<any>(this.urlEndpointClientes + '/page/' + page).pipe(
      map((response: any) => {
        (response.content as Cliente[]).map(cliente => {
          cliente.clientName = cliente.clientName.toUpperCase();
          return cliente;
        });
        return response;
      })
    );

  }

  getClients(): Observable<Cliente[]> {
    // return of(CLIENTS);      <<this form is used when we were using the json file locally>>
    return this.http.get(this.urlEndpointClientes).pipe(
      map(response => {

        const clientes = response as Cliente[];
        return clientes.map(cliente =>
          {
            cliente.clientName = cliente.clientName.toUpperCase();
            const datePipe = new DatePipe('En-en');
            // tslint:disable-next-line: max-line-length
            cliente.createdAt = datePipe.transform(cliente.createdAt, 'EEEE dd, MMMM yyyy'); // formatDate(cliente.createdAt, 'dd-MM-yyyy', 'En-en');
            return cliente;
          }
        );
      }
    )  // << this form is used when we use the map with functional programming
    );
    /*return this.http.get(this.urlEndpointClientes).pipe(
      map(function(response){ return response as Client[])  << this form is used when we use map with functions
    );*/

   // return this.http.get<Cliente[]>(this.urlEndpointClientes); // this form is used only casting the get method
  }

  createCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post(this.urlEndpointClientes, cliente).pipe(
      map((response: any) => response.client as Cliente) /*,
      catchError(e => {

        if (this.validateauthorities(e)){
          return throwError(e);
        }
        if (e.status == 400){
          return throwError(e);
        }
        console.error(e.error.mensaje);
        swal.fire("Error al crear el cliente", `Error ${e.error.mensaje} ${e.error.error}`, "error");
        return throwError(e);
      })*/
    );
  }

  getClient(id: any): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndpointClientes}/${id}`).pipe(
      catchError(e => {
        /*if (this.validateauthorities(e)){
          return throwError(e);
        }*/
        // tslint:disable-next-line: triple-equals
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/clients']);
          console.error(e.error.mensaje);
          // swal.fire("Error al editar", e.error.mensaje, 'error');
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
    /*return this.http.get<any>("http://localhost:8080/api/clientes/1").pipe(
      map((response) => response as Cliente)
    )*/
  }

  updateCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.put(`${this.urlEndpointClientes}/${cliente.id}`, cliente).pipe(
      map((response: any) => response.client as Cliente ),
      catchError(e => {
        /*if (this.validateauthorities(e)){
          return throwError(e);
        }*/
        if (e.status == 400 && e.error.mensaje) {
          console.error(e.error.mensaje);
          return throwError(e);

        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }

        return throwError(e);
      })
    );
  }

  deleteCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndpointClientes}/${cliente.id}`); /*.pipe(
      catchError(e => {
        if (this.validateauthorities(e)){
          return throwError(e);
        }
      })
    );*/
  }

  uploadPicture(file: File, id: any): Observable<HttpEvent<{}>> {
    const formData = new FormData();
    console.log('Values in service for file ' + file);
    console.log('Values in service for id ' + id);
    formData.append('archivo', file);
    formData.append('id', id);

    /*let httpHeaders: HttpHeaders = new HttpHeaders();
    let token = this.authService.token;
    if (token != null){
      httpHeaders = httpHeaders.append('Authorization', 'Bearer '+token);
    }*/

    const req = new HttpRequest('POST', `${this.urlEndpointClientes}/upload`, formData, {
      reportProgress: true
    });

    return this.http.request(req); /*.pipe(
      catchError(e => {
        if (this.validateauthorities(e)){
          return throwError(e);
        }

      })
    );*/
  }


  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(`${this.urlEndpointClientes}/regiones`, {headers: this.addAccessTokenToHeaders()} ); /*.pipe(
      catchError(e =>{
        if (this.validateauthorities(e)){
          return throwError(e)
        }
      })
    );*/
  }


}
