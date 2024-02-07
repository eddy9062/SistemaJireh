import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Observable, from, tap, mergeMap, finalize } from 'rxjs';

@Injectable()
export class LoadingService {

  private loadingModal?: HTMLIonLoadingElement = undefined

  constructor(private loadingController: LoadingController) { }

  public loading<T>(msg = "Espere por favor...", source: Observable<T>): Observable<T> {
    let loader: any;

    return from(this.loadingController.create({
      message: msg
    })).pipe(
      tap(res => {
        loader = res
        res.present()
      }),
      mergeMap(() => source),
      finalize(() => { loader.dismiss() })
    )
  }

  public async loadingPocketBase<T>(msg = "Espere por favor...", source: Promise<T>) {
    
    let modal = await this.loadingController.create({
      message: msg
    })
    modal.present()
    let resPromise;
    try {
      const result = await source;
      resPromise = Promise.resolve(result)
    } catch (error) {
      console.log(""+error)
      resPromise = Promise.reject(error)
      //throw error;
    } finally {
      modal.dismiss();
    }
    return resPromise
    /*let modal = await this.loadingController.create({
      message: msg
    })
    modal.present()

    let result   = await source

    console.log(result)
    modal.dismiss()
    return new Promise()*/
    /*.then(res => {

      console.log(res)
      modal.dismiss()
      Promise.resolve(res)
    }).catch(err => {
      modal.dismiss()
      return Promise.reject(err)
    })*/
    
  }

  async showLoading() {
    this.loadingModal = await this.loadingController.create({
      message: 'Cargando...'
    });
    await this.loadingModal.present();
  }

  hideLoading() {
    if (this.loadingModal) {
      this.loadingModal.dismiss();
    }
  }


}
