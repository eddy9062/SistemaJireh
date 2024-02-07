import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonList, IonicModule, ModalController } from '@ionic/angular';
import { HeaderComponent } from 'src/app/component/header/header.component';
import { Router } from '@angular/router';
import { FiltroPipe } from 'src/app/component/pipes/filtro.pipe';
import { LoadingService } from 'src/app/core/services/utils/loading.service';
import { ToastService } from 'src/app/core/services/utils/toast.service';
import { CategoriaModel } from 'src/app/core/services/models/CategoriaModel';
import { SessionService } from 'src/app/core/services/security/session.service';
import { CategoriaComponent } from './categoria/categoria.component';
import { CategoriaService } from 'src/app/core/services/categoria.service';


@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.page.html',
  styleUrls: ['./categoria.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HeaderComponent, ReactiveFormsModule,FiltroPipe]
})
export class CategoriaPage implements OnInit {
  public _listCategoria: CategoriaModel[] = [];
  _textoBuscar: string = '';
  public _empresa: any;

  @ViewChild(IonList) ionList: IonList | undefined;

  constructor(
    private sessionService: SessionService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private _categoriaService: CategoriaService,
    private router: Router,
    private modalCtrl: ModalController,
  ) {}

  ngOnInit(): void {
    this.sessionService.getEmpresa()?.subscribe((empre) => {
      this._empresa = empre;
      this.getCategorias();
    });
  }

  public redirect(menu: any) {
    this.router.navigate([menu.url]);
  }

  onSearch(event: any) {
    this._textoBuscar = event.detail.value;
  }

  RemoveItem(empresa: number, key: number) {
    this._listCategoria.forEach((value, index) => {
      if (value.cod_empresa == empresa && value.cat_articulo == key)
        this._listCategoria.splice(index, 1);
    });
  }

  public getCategorias() {
    this.loadingService
      .loading('Cargando información...', this._categoriaService.getCategorias())
      .subscribe({
        next: (response) => {
          console.table(response);
          this._listCategoria = response as unknown as Array<CategoriaModel>;
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

  onProducto(item?: CategoriaModel){}

  async onUpdate(item?: CategoriaModel) {
    
    const title = 2;
    const modal = await this.modalCtrl.create({
      component: CategoriaComponent,
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
        this.getCategorias();
        this.toastService.show('Registro Acutalizado', {
          position: 'middle',
          duration: 2000,
        });
      }
    });
    await modal.present();
  }

  async creaCategoria() {
    const title = 1;
    const empresa = this._empresa;
    console.log(empresa);
    const modal = await this.modalCtrl.create({
      component: CategoriaComponent,
      componentProps: {
        title,
        empresa,
      },
    });
    modal.onDidDismiss().then((item) => {
      this.ionList?.closeSlidingItems();
      if (item.data) {
        this.getCategorias();
        this.toastService.show('Registro creado', {
          position: 'middle',
          duration: 2000,
        });
      }
    });
    await modal.present();
  }

  onDelete(item: CategoriaModel) {
    this.loadingService
      .loading('Eliminando registro...', 
    this._categoriaService.deleteCategoria(item)).subscribe({
      next: (response) => {
        this.ionList?.closeSlidingItems();
        this.RemoveItem(item.cod_empresa, item.cat_articulo);
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
