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
import { ActivatedRoute, Params, Router } from '@angular/router';
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
    private modalCtrl: ModalController,
    private router: Router
  ) {
    this.formArticulo = this.fb.group({
      cat_articulo: ['', Validators.required],
      cod_articulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      obs: ['', Validators.required],
      //det: this.fb.array([])
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.item = params as unknown as ArticuloModel;
    });

    if (this.item?.cod_articulo) {
      this.getDetArticulo(this.item.cat_articulo, this.item.cod_articulo);
      console.log('Actualizar')
    } else {
      console.log('Nuevo')
    }

    this.creaEncabezado();
    this.getCategoria();
  }

  async creaEncabezado() {
    if (this.item) {
      this.formArticulo = this.fb.group({
        cat_articulo: [Number(this.item.cat_articulo), Validators.required],
        cod_articulo: [this.item.cod_articulo, Validators.required],
        descripcion: [this.item.descripcion, Validators.required],
        obs: [this.item.obs],
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

  async addDet() {
    const title = 1;
    const item = {
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

  async guardar() {
    if (this.formArticulo.valid) {
      this._dataProducto = this.formArticulo.value;
      this._dataProducto.det = this._listDetalle;
      this.crearRegistro(this._dataProducto);
    }

    console.log(this._dataProducto);

  }

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
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm(_true: boolean) {
    return this.modalCtrl.dismiss(_true, 'confirm');
  }

  
  async onUpdate(item?: DetArticuloModel) {
    
    const title = 2;
    const cat = Number(item?.cat_articulo);
    const cod = String(item?.cod_articulo);
    const modal = await this.modalCtrl.create({
      component: DetArticuloComponent,
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
        this.getDetArticulo(cat,cod);
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
