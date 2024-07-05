import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule,ReactiveFormsModule,FormGroup,FormBuilder,Validators,} from '@angular/forms';
import { IonList, IonicModule, ModalController } from '@ionic/angular';
import { DetVentaComponent } from './det-venta/det-venta.component';
import { MovModel } from 'src/app/core/services/models/MovModel';
import { DetMovModel } from 'src/app/core/services/models/DetMovModel';
import { ActivatedRoute, Router } from '@angular/router';
import { DetArticuloModel } from 'src/app/core/services/models/DetArticuloModel';
import { ToastService } from 'src/app/core/services/utils/toast.service';

// Importar moment con el formato de exportación adecuado
import * as moment from 'moment';
import { HeaderComponent } from "../../component/header/header.component";
import { FiltroPipe } from 'src/app/component/pipes/filtro.pipe';
import { TipoOperaModel } from 'src/app/core/services/models/TipoOperaModel';
import { BodegaService } from 'src/app/core/services/bodega.service';
import { ClientePage } from '../cliente/cliente.page';
import { MovproducComponent } from './movproduc/movproduc.component';

@Component({
    selector: 'app-venta',
    templateUrl: './venta.page.html',
    styleUrls: ['./venta.page.scss'],
    standalone: true,
    imports: [IonicModule,
      CommonModule,
      FormsModule,
      HeaderComponent,
      ReactiveFormsModule,
      FiltroPipe,]
})
export class VentaPage implements OnInit {
  item?: MovModel;
  titulo: string | undefined;
  _textoBuscar: string = '';

  
  fecha: string = moment().zone('GMT-6').format('YYYY-MM-DD').toString();

  formMov: FormGroup;

  public _listTipoOper: TipoOperaModel[] = [];
  public _dataProducto!: MovModel;
  public _listDetalle: DetMovModel[] = [];


public _destino: string | undefined;

  public title: string | undefined;
  public tipoReg: number | undefined;

  @ViewChild(IonList) ionList: IonList | undefined;

  constructor(
    private readonly route: ActivatedRoute,
    private fb: FormBuilder,
    private toastService: ToastService,
//    private _articuloService: ArticuloService,
    private _bodegaService: BodegaService,
    private modalCtrl: ModalController
  ) {
    this.formMov = this.fb.group({
        cod_empresa: [1, Validators.required],
        cod_tipo: [1, Validators.required],
        id_operacion: ['', Validators.required],
        fecha: [new Date(this.fecha).toISOString(), Validators.required],
        nit: ['', Validators.required]
    });
  }

  ngOnInit() {
  /*  this.route.queryParams.subscribe((params: Params) => {
      this.item = params as unknown as MovModel;
    });

    if (this.item?.cod_articulo) {
      this.getDetArticulo(this.item.cat_articulo, this.item.cod_articulo);
      console.log('Actualizar')
    } else {
      console.log('Nuevo')
    }
*/
    this.creaEncabezado();
    this.getTipoOperacion();
  }

  onSearch(event: any) {
    console.log(event)
    this._textoBuscar = event;
  }

  async addCliente() {
    const title = 1;

    //console.log(empresa);
    const modal = await this.modalCtrl.create({
      component: ClientePage,
      componentProps: {
        title
      },
    });
    modal.onDidDismiss().then((item) => {
      this.ionList?.closeSlidingItems();
           
      if (item.data) {
        console.log(item.data.nombre)
        this._destino = item.data.nombre;
        //this._listDetalle.push(item.data);
      }

    });
    await modal.present();
  }

  async findProducto(txtSearch: any) {
    const title = 1;

    //console.log(empresa);
    const modal = await this.modalCtrl.create({
      component: MovproducComponent,
      componentProps: {
        title,
        txtSearch
      },
    });
    modal.onDidDismiss().then((item) => {
      this.ionList?.closeSlidingItems();
           
      if (item.data) {
        console.log(item.data)
        //this._destino = item.data.nombre;
        //this._listDetalle.push(item.data);
      }

    });
    await modal.present();
  }


  async creaEncabezado() {
    if (this.item) {
      this.formMov = this.fb.group({
        cod_empresa: [Number(this.item.cod_empresa), Validators.required],
        cod_tipo: [this.item.tipo_operacion, Validators.required],
        id_operacion: [this.item.id_operacion, Validators.required],
        fecha: [this.item.fecha, Validators.required],
        nit: [this.item.nit, Validators.required],
      });
    }
  }


  creaDet() {
    return this.fb.control({
      cat_articulo: ['', Validators.required],
      cod_articulo: ['', Validators.required],
      cod_det_articulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio_venta: ['', Validators.required],
      unidades: ['', Validators.required],
      precio_mayoreo: ['', Validators.required],
      cant_mayoreo: ['', Validators.required],
    });
  }

  public changeDate(ev: any): void {
    try {
      this.fecha = ev.detail.value;
      //console.log(this.fecha);
    } catch (error) {
      console.error(error);
    }
  }


  async addDet() {
    const title = 1;
 /*   const item = {
      cat_articulo: this.formArticulo.value.cat_articulo,
      cod_articulo: this.formArticulo.value.cod_articulo,
      descripcion: this.formArticulo.value.descripcion
    };

    //console.log(empresa);
    const modal = await this.modalCtrl.create({
      component: DetArticuloComponent,
      componentProps: {
        title,
        item,
      },
    });
    modal.onDidDismiss().then((item) => {
      this.ionList?.closeSlidingItems();

            
      if (item.data) {
        this._listDetalle.push(item.data);
      }

    });
    await modal.present();*/
  }
/*
  get detControl() {
    return this.formArticulo.get('det') as FormArray;
  }*/

  public getTipoOperacion() {
    this._bodegaService.getTTipOperaciones().subscribe({
      next: (response) => {
        console.table(response);
        this._listTipoOper = response as unknown as Array<TipoOperaModel>;
      },
      error: (err) => {
        this.toastService.show(`Ocurrio un error ${err.message} `, {
          position: 'bottom',
          duration: 3000,
        });
      },
    });
  }

  public getArticulo(data: any) {
    /*this._articuloService.getArticulo(data).subscribe({
      next: (response) => {
        console.table(response);
        this.item = response as unknown as ArticuloModel;
      },
      error: (err) => {
        this.toastService.show(`Ocurrio un error ${err.message} `, {
          position: 'bottom',
          duration: 3000,
        });
      },
    });*/
  }
/*
  public getDetArticulo(cat: number, cod: string) {
    const data = {
      cat_articulo: cat,
      cod_articulo: cod
    }

    this._articuloService.getDetArticulo(data).subscribe({
      next: (response) => {
        this._listDetalle = response as unknown as Array<DetArticuloModel>;
      },
      error: (err) => {
        this.toastService.show(`Ocurrio un error ${err.message} `, {
          position: 'bottom',
          duration: 3000,
        });
      },
    });
  }
*/


  async guardar() {
    if (this.formMov.valid) {
      this._dataProducto = this.formMov.value;
      this._dataProducto.det = this._listDetalle;
  //    this.crearRegistro(this._dataProducto);
    }

    console.log(this._dataProducto);

  }
/*
  async actualizarRegistro(data: any) {
    this._articuloService.editarArticulo(data).subscribe({
      next: (response) => {
        console.log(response)

      },
      error: (err) => {
        this.toastService.show(`Ocurrio un error ${err.error.message} `, {
          position: 'bottom',
          duration: 4000,
        });
      },
    });
  }


  async crearRegistro(data: any) {
    console.log(data);
    this._articuloService.registraArticulo(data).subscribe({
      next: (response) => {
        console.log(response)
        //this.confirm(true);
        this.router.navigate(['/articulos'])
      },
      error: (err) => {
        console.log(err)
        this.toastService.show(`Ocurrio un error ${err.message} `, {
          position: 'bottom',
          duration: 4000,
        });
      },
    });
  }
  */
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm(_true: boolean) {
    return this.modalCtrl.dismiss(_true, 'confirm');
  }

  
  async onUpdate(item?: DetArticuloModel) {
    
    const title = 2;
    const bodega = Number(item?.cod_bodega);
    const cod = String(item?.cod_articulo);
    const modal = await this.modalCtrl.create({
      component: DetVentaComponent,
      componentProps: {
        item,
        title,
      },
    });
    modal.onDidDismiss().then((item_u) => {
      // Puedes manejar la respuesta del modal aquí si es necesario
      console.log(item)
      this.ionList?.closeSlidingItems();
      //this.getDetArticulo(item.);
      if (item_u.data) {
        //this.getDetArticulo(cat,cod);
        this.toastService.show('Registro Acutalizado', {
          position: 'middle',
          duration: 2000,
        });
      }
    });
    await modal.present();
  }


  onDelete(item: any){
    console.log(item)
  }

}
