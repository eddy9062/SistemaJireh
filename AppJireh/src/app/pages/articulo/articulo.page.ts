import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonList, IonicModule, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HeaderComponent } from 'src/app/component/header/header.component';
import { FiltroPipe } from 'src/app/component/pipes/filtro.pipe';
import { FiltroSegmentPipe } from 'src/app/component/pipes/filtro-segment.pipe';
import { LoadingService } from 'src/app/core/services/utils/loading.service';
import { ToastService } from 'src/app/core/services/utils/toast.service';
import { ArticuloModel } from 'src/app/core/services/models/ArticuloModel';
import { SessionService } from 'src/app/core/services/security/session.service';
import { ArticuloComponent } from './articulo/articulo.component';
import { ArticuloService } from 'src/app/core/services/articulo.service';
import { BodegaModel } from 'src/app/core/services/models/BodegaModels';
import { BodegaService } from 'src/app/core/services/bodega.service';

@Component({
  selector: 'app-articulo',
  templateUrl: './articulo.page.html',
  styleUrls: ['./articulo.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HeaderComponent, ReactiveFormsModule, FiltroPipe, FiltroSegmentPipe]
})
export class ArticuloPage implements OnInit {

  public _listArticulo: ArticuloModel[]= [];
  public _listBodega: BodegaModel[] = [];
  public _bodega?: BodegaModel;
  

    _textoBuscar: string = '';
    _textoBuscarSegment: number = 0;
  public _empresa: any;
  public _desbodega: string= '';

  @ViewChild(IonList) ionList: IonList | undefined;

  constructor(
    private sessionService: SessionService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private _articuloService: ArticuloService,
    private router: Router
  ) {}

  ngOnInit(): void {
    /*this.sessionService.getEmpresa()?.subscribe((empre) => {
      this._empresa = empre;
      this.getBodegas()
      this.getArticulos();
    });
*/
    this.getArticulos();
  }

  public redirect(menu: any) {
    this.router.navigate([menu.url]);
  }
/*
  segmentChanged(event: any ){
    if ( event.detail.value == 0 ){
      this._textoBuscarSegment = 0;
    }else{
      this._textoBuscarSegment = event.detail.value;
    }
  }

  selectBodega(item: any) {
    this._bodega = item;
  }*/

  onSearch(event: any) {
    this._textoBuscar = event.detail.value;
  }
/*
  onSearchSegment(event: any) {
    this._textoBuscarSegment = event.detail.value;
  }
  
  public getBodegas() {
    this._bodegaService.getBodegas()
      .subscribe({
        next: (response) => {
          console.table(response);
          this._listBodega = response as unknown as Array<BodegaModel>;
        },
        error: (err) => {
          this.toastService.show(`Ocurrio un error ${err.message} `, {
            position: 'bottom',
            duration: 3000,
          });
        },
      });
  }*/

  RemoveItem(empresa: number, cat: number, cod: string) {
    this._listArticulo.forEach((value, index) => {
      if (value.cod_empresa == empresa && value.cod_bodega == cat && value.cod_articulo == cod)
        this._listArticulo.splice(index, 1);
    });
  }

  public getArticulos() {
     this._articuloService.getArticulos()
      .subscribe({
        next: (response) => {
          console.table(response);
          this._listArticulo = response as unknown as Array<ArticuloModel>;
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

 /* public getArticulo(cod: string) {
    this._articuloService.getArticulo(this._empresa,cod)
     .subscribe({
       next: (response) => {
         console.table(response);
         this._listArticulo = response as unknown as Array<ArticuloModel>;
       },
       error: (err) => {
         this.toastService.show(`Ocurrio un error ${err.message} `, {
           position: 'bottom',
           duration: 3000,
         });
       },
     });
 }*/

  async onUpdate(item?: ArticuloModel) {
    //console.table(item)
    const data = {
      cod_bodega: item?.cod_bodega,
      cod_articulo: item?.cod_articulo,
      descripcion: item?.descripcion,
      obs: item?.obs
    }
   // this.router.navigate(['det-articulo'],{queryParams: {cod_empresa: item?.cod_empresa,cat_articulo: item?.cat_articulo,cod_bodega: item?.cod_bodega,cod_articulo: item?.cod_articulo}})
   this.router.navigate(['/articulo'],{queryParams: data})
  }

  async creaArticulo() {
    /*const data = {
      cod_empresa: this._bodega?.cod_empresa,
      cod_bodega: this._bodega?.cod_bodega,
    }
    this.router.navigate(['/articulo'],{queryParams: data})*/
    this.router.navigate(['/articulo'])
  }

  onDelete(item: ArticuloModel) {
    this.loadingService
      .loading('Eliminando registro...', 
    this._articuloService.deleteArticulo(item)).subscribe({
      next: (response) => {
        this.ionList?.closeSlidingItems();
        this.RemoveItem(item.cod_empresa, item.cod_bodega,item.cod_articulo);
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

  verDetalla(item:any){
   console.log(item)
  }
}
