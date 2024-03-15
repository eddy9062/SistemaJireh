import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonList, IonicModule, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/core/services/utils/loading.service';
import { ToastService } from 'src/app/core/services/utils/toast.service';
import { HeaderComponent } from "../../component/header/header.component";
import { FiltroPipe } from "../../component/pipes/filtro.pipe";
import { ProveedorModel } from 'src/app/core/services/models/ProveedorModel';
import { ProveedorComponent } from './proveedor/proveedor.component';
import { SessionService } from 'src/app/core/services/security/session.service';
import { ProveedorService } from '../../core/services/proveedor.service';

@Component({
    selector: 'app-proveedor',
    templateUrl: './proveedor.page.html',
    styleUrls: ['./proveedor.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, HeaderComponent, FiltroPipe]
})
export class ProveedorPage implements OnInit {
  
  public _listProveedor: ProveedorModel[] = [];
  _textoBuscar: string = '';
  public _empresa: any;

  @ViewChild(IonList) ionList: IonList | undefined;

  constructor(
    private sessionService: SessionService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private _proveedorService: ProveedorService,
    private router: Router,
    private modalCtrl: ModalController,
  ) {}

  ngOnInit(): void {
    this.sessionService.getEmpresa()?.subscribe((empre) => {
      this._empresa = empre;
      this.getProveedores();
    });
  }

  public redirect(menu: any) {
    this.router.navigate([menu.url]);
  }

  onSearch(event: any) {
    this._textoBuscar = event.detail.value;
  }

  RemoveItem(key: number) {
    this._listProveedor.forEach((value, index) => {
      if (value.cod_proveedor == key)
        this._listProveedor.splice(index, 1);
    });
  }

  public getProveedores() {
    this.loadingService
      .loading('Cargando información...', this._proveedorService.getProveedores())
      .subscribe({
        next: (response) => {
          console.table(response);
          this._listProveedor = response as unknown as Array<ProveedorModel>;
        },
        error: (err) => {
          this.toastService.show(`Ocurrio un error ${err.message} `, {
            position: 'bottom',
            duration: 3000,
          });
        },
      });
  }

  async onUpdate(item?: ProveedorModel) {
    
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
  }

  async creaProveedor() {
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
  }

  onDelete(item: ProveedorModel) {
    this.loadingService
      .loading('Eliminando registro...', 
    this._proveedorService.deleteProveedor(item)).subscribe({
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
}
