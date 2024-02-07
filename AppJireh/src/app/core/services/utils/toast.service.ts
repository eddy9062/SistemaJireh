import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastController: ToastController) { }

  async show(message: string, config: {
    position: 'top' | 'middle' | 'bottom',
    duration: number
  } = {
      position: 'bottom',
      duration: 4000
    }) {
    //  message: string, position: 'top' | 'middle' | 'bottom' = 'bottom',  duration = 4000) {    
    const toast = await this.toastController.create({
      message: message,
      duration: config.duration,
      position: config.position,
      buttons: [
        {
          text: "Cerrar",
          role: "cancel",
          handler: () => { }
        }
      ]
    })
    toast.present()
  }
}
