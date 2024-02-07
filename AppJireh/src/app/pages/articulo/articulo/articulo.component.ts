import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
} from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import {
  IonList,
  IonicModule,
  ModalController,
  NavParams,
} from '@ionic/angular';
import { HeaderComponent } from 'src/app/component/header/header.component';
import { FiltroPipe } from 'src/app/component/pipes/filtro.pipe';
import { ArticuloService } from 'src/app/core/services/articulo.service';
import { CategoriaService } from 'src/app/core/services/categoria.service';
import { ArticuloModel } from 'src/app/core/services/models/ArticuloModel';
import { CategoriaModel } from 'src/app/core/services/models/CategoriaModel';
import { ToastService } from 'src/app/core/services/utils/toast.service';
import { DetArticuloComponent } from '../det-articulo/det-articulo.component';
import { DetArticuloModel } from 'src/app/core/services/models/DetArticuloModel';

@Component({
  selector: 'app-articulo',
  templateUrl: './articulo.component.html',
  styleUrls: ['./articulo.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HeaderComponent,
    ReactiveFormsModule,
    FiltroPipe,
  ],
})
export class ArticuloComponent implements OnInit {
  item?: ArticuloModel;
  titulo: string | undefined;

  formArticulo: FormGroup;

  public _listCategoria: CategoriaModel[] = [];
  public _dataProducto!: ArticuloModel;
  public _listDetalle: DetArticuloModel[] = [];

  public title: string | undefined;
  public tipoReg: number | undefined;

  @ViewChild(IonList) ionList: IonList | undefined;

  constructor(
    private readonly route: ActivatedRoute,
    private fb: FormBuilder,
    private toastService: ToastService,
    private _articuloService: ArticuloService,
    private _categoriaService: CategoriaService,
    private modalCtrl: ModalController
  ) {
    this.formArticulo = this.fb.group({
      cod_empresa: [0, Validators.required],
      cat_articulo: ['', Validators.required],
      cod_bodega: [0, Validators.required],
      cod_articulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      existencia: ['', Validators.required],
      precio_compra: ['', Validators.required],
      obs: ['', Validators.required],
      //det: this.fb.array([])
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.item = params as unknown as ArticuloModel;
    });
    //this.getArticulo(this.item);
    console.log(this.item);
    this.creaEncabezado();
    this.getCategoria();
  }

  async creaEncabezado() {
    if (this.item) {
      //console.log(this.navParams.get('item'))
      this.formArticulo = this.fb.group({
        cod_empresa: [Number(this.item.cod_empresa), Validators.required],
        cat_articulo: [Number(this.item.cat_articulo), Validators.required],
        cod_bodega: [Number(this.item.cod_bodega), Validators.required],
        cod_articulo: [this.item.cod_articulo, Validators.required],
        descripcion: [this.item.descripcion, Validators.required],
        existencia: [this.item.existencia, Validators.required],
        precio_compra: [this.item.precio_compra, Validators.required],
        obs: [this.item.obs, Validators.required],
        //det: this.fb.array([this.creaDet()])
      });
    }
  }

  creaDet() {
    return this.fb.control({
      cod_empresa: ['', Validators.required],
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

  /*addDet() {
    dd
    (this.FormArticulo.get('det') as FormArray).push(this.creaDet())
    console.log(this.FormArticulo.value)
  }*/

  async addDet() {
    const title = 1;
    const dataArt = {
      cod_empresa: this.formArticulo.value.cod_empresa,
      cat_articulo: this.formArticulo.value.cat_articulo,
      cod_articulo: this.formArticulo.value.cod_articulo,
      descripcion: this.formArticulo.value.descripcion
    };

    //console.log(empresa);
    const modal = await this.modalCtrl.create({
      component: DetArticuloComponent,
      componentProps: {
        title,
        dataArt,
      },
    });
    modal.onDidDismiss().then((item) => {
      this.ionList?.closeSlidingItems();
      if (item.data) {
        //console.log(item.data)
        this._listDetalle.push(item.data);
        //this._dataProducto.det.push(item.data as unknown as DetArticuloModel);
        //this._dataProducto.det.push(item.data)
        /*(this.formArticulo.get('det') as FormArray).push(
          this.fb.group({
            cod_empresa: [item.data.cod_empresa, Validators.required],
            cat_articulo: [item.data.cat_articulo, Validators.required],
            cod_articulo: [item.data.cod_articulo, Validators.required],
            descripcion: [item.data.descripcion, Validators.required],
            precio_venta: [item.data.precio_venta, Validators.required],
            unidades: [item.data.unidades, Validators.required],
            precio_mayoreo: [item.data.precio_mayoreo, Validators.required],
            cant_mayoreo: [item.data.cant_mayoreo, Validators.required],
          })
        )*/
      }
    });
    await modal.present();
  }

  get detControl() {
    return this.formArticulo.get('det') as FormArray;
  }

  public getCategoria() {
    this._categoriaService.getCategorias().subscribe({
      next: (response) => {
        console.table(response);
        this._listCategoria = response as unknown as Array<CategoriaModel>;
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
    this._articuloService.getArticulo(data).subscribe({
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
    });
  }

  async guardar() {
    if (this.formArticulo.valid) {
      this._dataProducto = this.formArticulo.value;
        this._dataProducto.det = this._listDetalle;
      /*this._listDetalle.forEach(x => {
        console.log(x);
        this._dataProducto.det.push(x);
      });*/
      this.crearRegistro(this._dataProducto);
    }

    //console.log(this.FormArticulo.value)
    console.log(this._dataProducto);
    /*if (this.tipoReg == 1) {
      console.log('entre al crear')
      this.crearRegistro(this.FormArticulo.value);
    } else {
      console.log('entre al actializar')
      this.actualizarRegistro(this.FormArticulo.value);
    }*/
  }

  async actualizarRegistro(data: any) {
    this._articuloService.editarArticulo(data).subscribe({
      next: (response) => {
        //this.confirm(true);
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
}
