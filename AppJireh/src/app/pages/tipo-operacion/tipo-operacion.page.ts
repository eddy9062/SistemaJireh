import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonList, IonicModule, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HeaderComponent } from 'src/app/component/header/header.component';
import { FiltroPipe } from 'src/app/component/pipes/filtro.pipe';
import { LoadingService } from 'src/app/core/services/utils/loading.service';
import { ToastService } from 'src/app/core/services/utils/toast.service';
import { TipoOperaModel } from 'src/app/core/services/models/TipoOperaModel';
import { TipoOperacionComponent } from './tipo-operacion/tipo-operacion.component';
import { BodegaService } from 'src/app/core/services/bodega.service';
import { SessionService } from 'src/app/core/services/security/session.service';

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
  

  @ViewChild(IonList) ionList: IonList | undefined;

  constructor(
    private sessionService: SessionService,
    private loadingService: LoadingService,
    private router: Router,
    private toastService: ToastService,
    private modalCtrl: ModalController,
    private _tipoOpeService: BodegaService
  ) { }

  
  ngOnInit(): void {
    this.getTipoOperacion();
}

public redirect(menu: any) {
  this.router.navigate([menu.url]);
}

onSearch(event: any) {
  this._textoBuscar = event.detail.value;
}

RemoveItem(key: number) {
  this._listTipoOpera.forEach((value, index) => {
    if (value.cod_tipo == key)
      this._listTipoOpera.splice(index, 1);
  });
}

public getTipoOperacion() {
  this.loadingService
    .loading('Cargando información...', this._tipoOpeService.getTTipOperaciones())
    .subscribe({
      next: (response) => {
        console.table(response);
        this._listTipoOpera = response as unknown as Array<TipoOperaModel>;
      },
      error: (err) => {
        if (err.status == 403) {
          this.toastService.show(err.error.message, {
            position: 'bottom',
            duration: 3000,
          });
          this.sessionService.logOut();
        } else {
          this.toastService.show(`Ocurrio un error ${err.message} `, {
            position: 'bottom',
            duration: 3000,
          });
        }
      },
    });
}

async onUpdate(item?: TipoOperaModel) {
  
  const title = 2;
  const modal = await this.modalCtrl.create({
    component: TipoOperacionComponent,
    componentProps: {
      item,
      title,
    },
  });
  modal.onDidDismiss().then((item) => {
    // Puedes manejar la respuesta del modal aquí si es necesario
    //console.log(item)
    this.ionList?.closeSlidingItems();
    if (item.data) {
      this.getTipoOperacion();
      this.toastService.show('Registro Acutalizado', {
        position: 'middle',
        duration: 2000,
      });
    }
  });
  await modal.present();
}

async creaTipOperacion() {
  const title = 1;
  const modal = await this.modalCtrl.create({
    component: TipoOperacionComponent,
    componentProps: {
      title,
    },
  });
  modal.onDidDismiss().then((item) => {
    this.ionList?.closeSlidingItems();
    if (item.data) {
      this.getTipoOperacion();
      this.toastService.show('Registro creado', {
        position: 'middle',
        duration: 2000,
      });
    }
  });
  await modal.present();
}

onDelete(item: TipoOperaModel) {

  console.log(item)

  this.loadingService
    .loading('Eliminando registro...', 
  this._tipoOpeService.deleteTipOperacion(item)).subscribe({
    next: (response) => {
      this.ionList?.closeSlidingItems();
      this.RemoveItem(item.cod_tipo);
      //console.log(response);
      this.toastService.show('Registro eliminado', {
        position: 'middle',
        duration: 2000,
      });
    },
    error: (err) => {
      this.toastService.show(`Ocurrio un error ${err.error.message} `, {
        position: 'bottom',
        duration: 4000,
      });
    },
  });
}
}



