import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CategoriaModel } from './models/CategoriaModel';
import { SessionService } from './security/session.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  
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
  registraCategoria(data: any): Observable<any> {
    //console.log(data);
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this._token}`);
    return this._http.post(this.url + 'categoria', data, { headers: headers });
  }

  getCategorias(): Observable<CategoriaModel> {
    //console.log(this.sessionService.getToken().value)
    //console.log(this._token)
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${this._token}`);
    return this._http.get<CategoriaModel>(this.url + 'categorias', { headers: headers });
  }

  getCategoria(id: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'user/' + id, { headers: headers });
  }

  editarCategoria(data: any): Observable<any> {
    //console.log(data);
    //console.log(this._token);
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this._token}`);
    return this._http.patch(this.url + 'categoria', data, { headers: headers });
  }

  deleteCategoria(data: any): Observable<any> {
    const item = {
      cod_empresa: data.cod_empresa,
      cat_articulo: data.cat_articulo
    }
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this._token}`);
    return this._http.delete(this.url + 'categoria', {
      headers: headers,
      body: item
   });
  }

}
