import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs';
import { UsuarioPassword } from '../models/UsuarioPassword.model';
import { Router } from '@angular/router';
import { AuthService } from '../security/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  
  public tokenResult: any

  private KEY_USER = `SECURITY_USER`
  private KEY_NETWORK = `SECURITY_NETWORK`
  public static KEY_JWT = `SECURITY_JWT`
  public  KEY_CONFIG = `CONFIG`
  private  KEY_USER_STR = "KEY_USER_STR"
  //private _storage!: Storage
  private _redSeleccionada = new BehaviorSubject(false)
  private _usuario = new BehaviorSubject<UsuarioPassword | null>(null)
  private _usuarioStr = new BehaviorSubject<String | null>(null)
  private _empresa = new BehaviorSubject<String | null>(null)
  private _token = new BehaviorSubject<string | null>(null)
  private _roles = new BehaviorSubject<Array<string>>([])
  constructor( private router: Router) { 
    this.start();
  }

  public async start() {
    let network = await Preferences.get({ key: this.KEY_NETWORK });
    this._redSeleccionada.next(network.value == "true")
    let usuario = await Preferences.get({ key: this.KEY_USER });

    if (usuario.value == null)
      this._usuario.next(null)
    else
      this._usuario.next(JSON.parse(usuario.value))
      
    let token = await Preferences.get({ key: SessionService.KEY_JWT });
//usuario
    let usuarioStr = await Preferences.get({ key: this.KEY_USER_STR });
    if (usuarioStr.value == null) {
      this._usuarioStr.next(null)
    } else {
      this._usuarioStr.next(usuarioStr.value)
    }
//empresa
    let empresaStr = await Preferences.get({ key: this.KEY_CONFIG });
    if (empresaStr.value == null) {
      this._empresa.next(null)
    } else {
      this._empresa.next(empresaStr.value)
    }


    this._token.next(token.value)
    
    this.getRoles()
    //this.validaToken(this._token);
  }

  public reset() {
    this._redSeleccionada.next(false)
    this._usuario.next(null)
  }

  public async setRedSeleccionada(red: boolean) {
    await Preferences.set({
      key: this.KEY_NETWORK,
      value: JSON.stringify(red),
    });
    this._redSeleccionada.next(red)
  }

  public async guardarUsuario(recuerdame: boolean = false, usuario: UsuarioPassword) {
    if (recuerdame) {
      await Preferences.set({
        key: this.KEY_USER,
        value: JSON.stringify(usuario),
      });
      this._usuario.next(usuario)
    } else {
      await Preferences.remove({ key: this.KEY_USER });
      this._usuario.next(null)
    }
  }

  public async guardarUsuarioStr(usuario: string) {
    await Preferences.set({
      key: this.KEY_USER_STR,
      value: usuario,
    });
    this._usuarioStr.next(usuario)
    
  }
  public async guardarConfig(token: string) {

    let empresa = await JSON.parse(window.atob(token.split('.')[1]))["cod_empresa"]

    await Preferences.set({
      key: this.KEY_CONFIG,
      value: empresa,
    });
    this._empresa.next(empresa)
  }

  public async guardarToken(token: string) {
    await Preferences.set({
      key: SessionService.KEY_JWT,
      value: token,
    });
    this._token.next(token)
  }

  

  private async getRoles() {
    let token: string | null
    if (this._token.value == null) {
      let tokenPref = await Preferences.get({ key: SessionService.KEY_JWT });
      token = tokenPref.value
    } else {
      token = this._token.value
    }
    try {
      if (token != null) {
        //this._empresa = JSON.parse(window.atob(token.split('.')[1]))["cod_empresa"]
        let roles = JSON.parse(window.atob(token.split('.')[1]))["groups"]
        if (Array.isArray(roles)) {
          this._roles.next(roles)
        }
      }
    } catch (ex) { }
  }



  public usuarioSub() {
    return this._usuario
  }

  public getEmpresa() {
    return this._empresa
  }

  public usuarioStrSub() {
    return this._usuarioStr
  }

  public redSeleccionadaSub() {
    return this._redSeleccionada
  }

  public async token() {
    this.tokenResult = await Preferences.get({ key: SessionService.KEY_JWT })
    //console.log(tokenResult)
    return this.tokenResult.value
  }

  public tokenSub() {
    return this._token
  }

  public  getToken(){
    return this.tokenResult
  }
  public async isLoggedIn() {
    let token = await Preferences.get({ key: SessionService.KEY_JWT })
    return (token.value != null)
  }


  public async logOut() {
    await Preferences.remove({ key: SessionService.KEY_JWT });
    await this._token.next(null)
    this._roles.next([])
    this.router.navigateByUrl("/login")
  }


  public async validarRol(rol: string) {
    if (this._roles.value.length <= 0) {
      await this.getRoles()
    }
    return Promise.resolve(this._roles.value.includes(rol))
  }

}
