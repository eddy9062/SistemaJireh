import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProveedorModel } from './models/ProveedorModel';
import { SessionService } from './security/session.service';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  
  public url;
  public host;
  public _token?: any;
  public _empresa?: any;
  public _identity: any;

  constructor(
    private _http: HttpClient,
    private sessionService: SessionService
  ) {
    this.host = this.sessionService.redSeleccionadaSub().value ? environment.host_intra_auth : environment.host_auth;
    this.url = `${environment.api_url.replace('{host}', this.host.host).replace('50000', this.host.port)}/api/`;
    this._token = this.sessionService.getToken().value;
  }

  ngOnInit(): void {
  }

   getProveedores(): Observable<ProveedorModel> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${this._token}`);
    return this._http.get<ProveedorModel>(this.url + 'proveedores', { headers: headers });
  }

  getProveedor(id: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'proveedor/' + id, { headers: headers });
  }

  registraProveedor(data: any): Observable<any> {
    //console.log(data);
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this._token}`);
    return this._http.post(this.url + 'proveedor', data, { headers: headers });
  }
  editarProveedor(data: any): Observable<any> {
    //console.log(data);
    //console.log(this._token);
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this._token}`);
    return this._http.patch(this.url + 'proveedor', data, { headers: headers });
  }

  deleteProveedor(data: any): Observable<any> {
    const item = {
      cod_empresa: data.cod_empresa,
      cod_proveedor: data.cod_proveedor
    }
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this._token}`);
    return this._http.delete(this.url + 'proveedor', {
      headers: headers,
      body: item
   });
  }

}
