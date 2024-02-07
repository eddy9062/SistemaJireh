import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private alertController: AlertController
  ) { }

  async alertConfirm(header: string, msg: string, callbackConfirm: () => void, callbackCancel: () => void){
    const alert = await this.alertController.create({
      header: header,
      message: msg,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            //this.handlerMessage = 'Alert canceled';
            callbackCancel()
          },
        },
        {
          text: 'Confirmar',
          role: 'confirm',
          handler: () => {
            //this.handlerMessage = 'Alert confirmed';
            callbackConfirm()
          },
        },
      ],
    });
    await alert.present();
  
    //const { role } = await alert.onDidDismiss();
  }
}
