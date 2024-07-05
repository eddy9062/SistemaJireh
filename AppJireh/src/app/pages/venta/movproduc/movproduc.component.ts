import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonList, IonicModule, ModalController, NavParams } from '@ionic/angular';
import { HeaderComponent } from "../../../component/header/header.component";
import { ArticuloModel } from 'src/app/core/services/models/ArticuloModel';
import { Router } from '@angular/router';
import { ProveedorModel } from 'src/app/core/services/models/ProveedorModel';
import { SessionService } from 'src/app/core/services/security/session.service';
import { LoadingService } from 'src/app/core/services/utils/loading.service';
import { ToastService } from 'src/app/core/services/utils/toast.service';
import { ArticuloService } from 'src/app/core/services/articulo.service';
import { ArticuloMovModel } from 'src/app/core/services/models/ArticuloMovModel';

@Component({
    selector: 'app-movproduc',
    templateUrl: './movproduc.component.html',
    styleUrls: ['./movproduc.component.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent]
})
export class MovproducComponent  implements OnInit {

  public _listProducto: ArticuloMovModel[] = [];
  _textoBuscar: string = '';
  public _empresa: any;

  @ViewChild(IonList) ionList: IonList | undefined;

  constructor(
    private sessionService: SessionService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private _articuloService: ArticuloService,
    private router: Router,
    private modalCtrl: ModalController,
    private navParams: NavParams,) { }



  ngOnInit(): void {
    this.sessionService.getEmpresa()?.subscribe((empre) => {
      this._empresa = empre;
      this._textoBuscar = this.navParams.get('txtSearch');
      this.getProducto();
    });

    

    console.log(this._textoBuscar)
    
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm(_true: boolean) {
    return this.modalCtrl.dismiss(_true, 'confirm');
  }

  public redirect(menu: any) {
    this.router.navigate([menu.url]);
  }

  onSearch(event: any) {
    this._textoBuscar = event.detail.value;
  }

  RemoveItem(key: number) {
    console.log(key)
    /*this._listProducto.forEach((value, index) => {
      if (value.cod_articulo == key)
        this._listProducto.splice(index, 1);
    });*/
  }

  public getProducto() {
    
    const data = {
      cod_empresa : this._empresa,
      txtSearch : this._textoBuscar
    }

    this.loadingService
      .loading('Cargando información...', this._articuloService.getArticuloMov(data))
      .subscribe({
        next: (response) => {
          console.log(response);
          this._listProducto = response as unknown as Array<ArticuloMovModel>;
        },
        error: (err) => {
          this.toastService.show(`Ocurrio un error ${err.message} `, {
            position: 'bottom',
            duration: 3000,
          });
        },
      });
  }

  async onUpdate(item?: ArticuloMovModel) {
    console.log(item);
    /*
    const title = 2;
    const modal = await this.modalCtrl.create({
      component: ProveedorComponent,
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
        this.getProveedores();
        this.toastService.show('Registro Acutalizado', {
          position: 'middle',
          duration: 2000,
        });
      }
    });
    await modal.present();

    */
  }

  async creaProveedor() {
    console.log('creaProveedor')
    /*
    const title = 1;
    const modal = await this.modalCtrl.create({
      component: ProveedorComponent,
      componentProps: {
        title,
      },
    });
    modal.onDidDismiss().then((item) => {
      this.ionList?.closeSlidingItems();
      if (item.data) {
        this.getProveedores();
        this.toastService.show('Registro creado', {
          position: 'middle',
          duration: 2000,
        });
      }
    });
    await modal.present();
    */
  }

  onDelete(item: ArticuloMovModel) {
    console.log(item)
/*
    this.loadingService
      .loading('Eliminando registro...', 
    this._articuloService.deleteProveedor(item)).subscribe({
      next: (response) => {
        this.ionList?.closeSlidingItems();
        this.RemoveItem(item.cod_proveedor);
        console.log(response);
        this.toastService.show('Registro eliminado', {
          position: 'middle',
          duration: 2000,
        });
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
  */
}

}


