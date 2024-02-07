import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilsPlataformaService {

  private _isNative: boolean  = false

  constructor(private platform: Platform) { 
    this._isNative = Capacitor.isNativePlatform()
  }

  isIOS() {
    return this.platform.is("ios")
  }

  isNative(){
    //return this._isNative
    return  environment.production ? this._isNative : true 
  }

  isNativePlatform(){
    return this._isNative;
  }

}
