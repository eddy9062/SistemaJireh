import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsuarioPassword } from '../models/UsuarioPassword.model';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public _identity: any;

  constructor(
    private http: HttpClient,
    private sessionService: SessionService
  ) //private pocketvaseService: PocketbaseService
  {}

  /*
  loginPocketbase(credenciales: UsuarioPassword){
      return this.pocketvaseService.getInstance().collection('users').authWithPassword(credenciales.usuario,credenciales.password)
  }*/

  login(recuerdame: boolean, credenciales: UsuarioPassword): Observable<any> {
    let host = this.sessionService.redSeleccionadaSub().value
      ? environment.host_intra_auth
      : environment.host_auth;
    //let url = `${environment.api_url.replace('{host}', host.host).replace('50000', host.port)}/jwt-provider-v2/auth/db`;
    let url = `${environment.api_url
      .replace('{host}', host.host)
      .replace('50000', host.port)}/api/login`;
    //console.log(url)
    //console.log(credenciales)

    let json = credenciales;
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(url, json, { headers: headers }).pipe(
      map((resp) => {
        //console.log(resp)
        this._identity = resp;
        //console.log('servicio login ', resp);
        this.sessionService.guardarUsuarioStr(credenciales.usuario);
        this.sessionService.guardarUsuario(recuerdame, credenciales);
        this.sessionService.guardarToken(this._identity.token);
        this.sessionService.guardarConfig(this._identity.token);
        return resp;
      })
    );
  }

}
