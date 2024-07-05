import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ArticuloModel } from './models/ArticuloModel';
import { SessionService } from './security/session.service';

@Injectable({
  providedIn: 'root'
})
export class ArticuloService {

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

   getArticulos(): Observable<ArticuloModel> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${this._token}`);
    return this._http.get<ArticuloModel>(this.url + 'articulos', { headers: headers });
  }

  getArticulo(_data: any): Observable<any> {

    console.log(_data)
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${this._token}`);
    return this._http.post(this.url + 'lstarticulo',_data, { headers: headers });
  }

  getDetArticulo(_data: any): Observable<any> {

    console.log(_data)
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${this._token}`);
    return this._http.post(this.url + 'lstdetarticulo',_data, { headers: headers });
  }

  registraArticulo(data: any): Observable<any> {
    //console.log(data);
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this._token}`);
    return this._http.post(this.url + 'articulo', data, { headers: headers });
  }

  editarArticulo(data: any): Observable<any> {
    //console.log(data);
    //console.log(this._token);
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this._token}`);
    return this._http.patch(this.url + 'articulo', data, { headers: headers });
  }

  editarDetArticulo(data: any): Observable<any> {
    //console.log(data);
    //console.log(this._token);
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this._token}`);
    return this._http.post(this.url + 'det_articulo', data, { headers: headers });
  }

  deleteArticulo(data: any): Observable<any> {
    const item = {
      cod_empresa: data.cod_empresa,
      cod_articulo: data.cod_articulo
    }
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this._token}`);
    return this._http.delete(this.url + 'articulo', {
      headers: headers,
      body: item
   });
  }

  deleteDetArticulo(data: any): Observable<any> {
    const item = {
      cod_bodega: data.cod_bodega,
      cod_articulo: data.cod_articulo,
      cod_det_articulo: data.cod_det_articulo
    }
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this._token}`);
    return this._http.delete(this.url + 'det_articulo', {
      headers: headers,
      body: item
   });
  }
// Para Movimientos
  getArticuloMov(_data: any): Observable<any> {
    console.log(_data)
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${this._token}`);
    return this._http.post(this.url + 'lstarticuloMov',_data, { headers: headers });
  }


}
