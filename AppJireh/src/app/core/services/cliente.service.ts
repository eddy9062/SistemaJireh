import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionService } from './security/session.service';
import { ClienteModel } from './models/ClienteModel';

@Injectable({
  providedIn: 'root',
})
export class ClienteService  implements OnInit{

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
    //this._token = this.sessionService.getToken().value;
    /*this.sessionService.token().then(resultToken => {
      this._token = resultToken
    })*/
    console.log('Entre al OnInit')
  }

  /*getToken() : string  {
    const _tokenStorage = localStorage.getItem('token-jireh')
   
    let _token = null;
    if (this._identity != null){
      _token = this._identity.token;
    } else if(_tokenStorage !==  null){
      _token = JSON.parse(_tokenStorage).token;
    }
    return _token;
  }*/

 

  registraCliente(data: any): Observable<any> {
    //console.log(data);
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this._token}`);
    return this._http.post(this.url + 'cliente', data, { headers: headers });
  }

  getClientes(): Observable<ClienteModel> {
    //console.log(this.sessionService.getToken().value)
    //console.log(this._token)
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${this._token}`);
    return this._http.get<ClienteModel>(this.url + 'clientes', { headers: headers });
  }

  getCliente(id: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'user/' + id, { headers: headers });
  }

  editarCliente(data: any): Observable<any> {
    //console.log(data);
    //console.log(this._token);
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this._token}`);
    return this._http.patch(this.url + 'cliente', data, { headers: headers });
  }

  deleteCliente(data: any): Observable<any> {
    const item = {
      cod_empresa: data.cod_empresa,
      cod_cliente: data.cod_cliente
    }
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this._token}`);
    return this._http.delete(this.url + 'cliente', {
      headers: headers,
      body: item
   });
  }

}
