import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonList, IonicModule, ModalController } from '@ionic/angular';
import { BodegaModel } from 'src/app/core/services/models/BodegaModels';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/core/services/security/session.service';
import { LoadingService } from 'src/app/core/services/utils/loading.service';
import { ToastService } from 'src/app/core/services/utils/toast.service';
import { BodegaComponent } from './bodega/bodega.component';
import { BodegaService } from 'src/app/core/services/bodega.service';
import { HeaderComponent } from "../../component/header/header.component";
import { FiltroPipe } from "../../component/pipes/filtro.pipe";
import { error } from 'console';

@Component({
    selector: 'app-bodega',
    templateUrl: './bodega.page.html',
    styleUrls: ['./bodega.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, HeaderComponent, FiltroPipe]
})
export class BodegaPage implements OnInit {
  
  public _listBodega: BodegaModel[] = [];
  _textoBuscar: string = '';
  public _empresa: any;

  @ViewChild(IonList) ionList: IonList | undefined;

  constructor(
    private sessionService: SessionService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private _bodegaService: BodegaService,
    private router: Router,
    private modalCtrl: ModalController,
  ) {}

  ngOnInit(): void {
    this.sessionService.getEmpresa()?.subscribe((empre) => {
      this._empresa = empre;
      this.getBodegas();
    });
  }

  public redirect(menu: any) {
    this.router.navigate([menu.url]);
  }

  onSearch(event: any) {
    this._textoBuscar = event.detail.value;
  }

  RemoveItem(empresa: number, key: number) {
    this._listBodega.forEach((value, index) => {
      if (value.cod_empresa == empresa && value.cod_bodega == key)
        this._listBodega.splice(index, 1);
    });
  }

  public getBodegas() {
    this.loadingService
      .loading('Cargando información...', this._bodegaService.getBodegas())
      .subscribe({
        next: (response) => {
          console.table(response);
          this._listBodega = response as unknown as Array<BodegaModel>;
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

  async onUpdate(item?: BodegaModel) {
    
    const title = 2;
    const modal = await this.modalCtrl.create({
      component: BodegaComponent,
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
        this.getBodegas();
        this.toastService.show('Registro Acutalizado', {
          position: 'middle',
          duration: 2000,
        });
      }
    });
    await modal.present();
  }

  async creaBodega() {
    const title = 1;
    const empresa = this._empresa;
    console.log(empresa);
    const modal = await this.modalCtrl.create({
      component: BodegaComponent,
      componentProps: {
        title,
        empresa,
      },
    });
    modal.onDidDismiss().then((item) => {
      this.ionList?.closeSlidingItems();
      if (item.data) {
        this.getBodegas();
        this.toastService.show('Registro creado', {
          position: 'middle',
          duration: 2000,
        });
      }
    });
    await modal.present();
  }

  onDelete(item: BodegaModel) {
    this.loadingService
      .loading('Eliminando registro...', 
    this._bodegaService.deleteBodega(item)).subscribe({
      next: (response) => {
        this.ionList?.closeSlidingItems();
        this.RemoveItem(item.cod_empresa, item.cod_bodega);
        console.log(response);
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
