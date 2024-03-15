import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionService } from './security/session.service';
import { BodegaModel } from './models/BodegaModels';
import { TipoOperaModel } from './models/TipoOperaModel';

@Injectable({
  providedIn: 'root'
})
export class BodegaService {

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

   getBodegas(): Observable<BodegaModel> {
    //console.log(this._token)
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${this._token}`);
    return this._http.get<BodegaModel>(this.url + 'bodegas', { headers: headers });
  }

  getBodega(id: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'bodega/' + id, { headers: headers });
  }

  registraBodega(data: any): Observable<any> {
    //console.log(data);
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this._token}`);
    return this._http.post(this.url + 'bodega', data, { headers: headers });
  }
  editarBodega(data: any): Observable<any> {
    //console.log(data);
    //console.log(this._token);
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this._token}`);
    return this._http.patch(this.url + 'bodega', data, { headers: headers });
  }

  deleteBodega(data: any): Observable<any> {
    const item = {
      cod_empresa: data.cod_empresa,
      cod_bodega: data.cod_bodega
    }
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this._token}`);
    return this._http.delete(this.url + 'bodega', {
      headers: headers,
      body: item
   });
  }

// Tipos de operacion

getTTipOperaciones(): Observable<TipoOperaModel> {
  //console.log(this._token)
  let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${this._token}`);
  return this._http.get<TipoOperaModel>(this.url + 'operaciones', { headers: headers });
}

getTipOperacion(id: any): Observable<any> {
  let headers = new HttpHeaders().set('Content-Type', 'application/json');
  return this._http.get(this.url + 'operacion/' + id, { headers: headers });
}

registraTipOperacion(data: any): Observable<any> {
  //console.log(data);
  let headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${this._token}`);
  return this._http.post(this.url + 'operacion', data, { headers: headers });
}
editarTipOperacion(data: any): Observable<any> {
  //console.log(data);
  //console.log(this._token);
  let headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${this._token}`);
  return this._http.patch(this.url + 'operacion', data, { headers: headers });
}

deleteTipOperacion(data: any): Observable<any> {
  const item = {
    cod_tipo: data.cod_tipo
  }
  let headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${this._token}`);
  return this._http.delete(this.url + 'operacion', {
    headers: headers,
    body: item
 });
}




}
