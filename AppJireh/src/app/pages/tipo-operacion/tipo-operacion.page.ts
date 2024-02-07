import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonList, IonicModule, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HeaderComponent } from 'src/app/component/header/header.component';
import { FiltroPipe } from 'src/app/component/pipes/filtro.pipe';
import { EmpresaModel } from 'src/app/core/services/models/EmpresaModel';
import { LoadingService } from 'src/app/core/services/utils/loading.service';
import { ToastService } from 'src/app/core/services/utils/toast.service';
import { TipoOperaModel } from 'src/app/core/services/models/TipoOperaModel';
import { TipoOperacionComponent } from './tipo-operacion/tipo-operacion.component';

@Component({
  selector: 'app-tipo-operacion',
  templateUrl: './tipo-operacion.page.html',
  styleUrls: ['./tipo-operacion.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HeaderComponent, ReactiveFormsModule,FiltroPipe]
})
export class TipoOperacionPage implements OnInit {


  public _listTipoOpera: TipoOperaModel[]= [];
  _textoBuscar: string = '';
  public _listEmpresa: EmpresaModel[] | undefined

  @ViewChild(IonList) ionList: IonList | undefined;

  constructor(
    private loadingService: LoadingService,
        private router: Router,
    private toastService: ToastService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit(): void {
    //this.getTipoOpera()
  }

  public redirect(menu: any) {
    this.router.navigate([menu.url]);
  }

  onSearch(event: any) {
    //console.log(event)
    //console.log(event.detail.value)
    this._textoBuscar = event.detail.value
    //const query = event.target.value.toLowerCase();
    //this._listTipoOpera = this._listTipoOpera.filter((d) => d.toLowerCase().indexOf(query) > -1);
  }

/*
  public getTipoOpera() {
    this.loadingService.loadingPocketBase('Cargando información...',
      this.pbService.getTipoOpera()).then((result: any) => {
        console.log(result)
        this._listTipoOpera = (result as unknown as Array<TipoOperaModel>)

      }).catch(err => {
        this.toastService.show(`Ocurrio un error ${err.message} `, {
          position: 'bottom',
          duration: 4000
        })
      });
    //this.pbService.getTipoOpera();
  }

  onDelete(item: TipoOperaModel) {
    console.log('delete ' + JSON.stringify(item))
    this.ionList?.closeSlidingItems();
    this.loadingService.loadingPocketBase("Cargando información...",
      this.pbService.deleteTipoOpera(item.id)).then((result: any) => {
        console.log(result)
        if (result) {
          this.getTipoOpera();
        }
        //this._listTipoOpera = (result as unknown as  Array<TipoOperaModel>)
      }).catch(err => {
        this.toastService.show(`Ocurrio un error ${err.message} `, {
          position: 'bottom',
          duration: 4000
        })
      })
  }

  async onUpdate(item?: TipoOperaModel) {
    //console.log('click modal '+item)
    const title = 2
    const modal = await this.modalCtrl.create({
      component: TipoOperacionComponent,
      componentProps: {
        item,
        title
      }
    });
    modal.onDidDismiss().then((item) => {
      // Puedes manejar la respuesta del modal aquí si es necesario
      console.log(item)
      this.ionList?.closeSlidingItems();
      if (item.data) {
        this.getTipoOpera()
        this.toastService.show('Registro Acutalizado', {
          position: 'middle',
          duration: 4000
        })
      }
    });

    await modal.present();
    }

  async creaTipoOpera() {
    const title = 1
    const modal = await this.modalCtrl.create({
      component: TipoOperacionComponent,
      componentProps: {
        title
      }
    });
    modal.onDidDismiss().then((item) => {
      // Puedes manejar la respuesta del modal aquí si es necesario
      console.log(item)
      this.ionList?.closeSlidingItems();
      if (item.data) {
        this.getTipoOpera()
        this.toastService.show('Registro Acutalizado', {
          position: 'middle',
          duration: 4000
        })
      }
    });
    await modal.present();
  }*/

  onUpdate(item?: TipoOperaModel) {
  }
  onDelete(item: TipoOperaModel) {

  }
  creaTipoOpera() {
    
  }
}


