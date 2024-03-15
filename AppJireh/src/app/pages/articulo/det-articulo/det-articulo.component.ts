import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { ArticuloService } from 'src/app/core/services/articulo.service';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { ToastService } from 'src/app/core/services/utils/toast.service';

@Component({
  selector: 'app-det-articulo',
  templateUrl: './det-articulo.component.html',
  styleUrls: ['./det-articulo.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class DetArticuloComponent  implements OnInit {
  name: string | undefined;
  FormDetArticulo!: FormGroup;
  
  public receivedData: any;
  public title: string | undefined;
  public tipoReg: number | undefined;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private toastService: ToastService,
    private _articuloService: ArticuloService
  ) {

    //this.receivedData = this.navParams.get('dataArt');
    this.receivedData = this.navParams.get('item');

    console.log(this.receivedData)

    this.FormDetArticulo = this.fb.group({
        cat_articulo: [this.receivedData.cat_articulo, Validators.required],
        cod_articulo: [this.receivedData.cod_articulo, Validators.required],
        cod_det_articulo: [this.receivedData.cod_det_articulo, Validators.required],
        descripcion: [this.receivedData.descripcion, Validators.required],
        precio_venta: [this.receivedData.precio_venta, Validators.required],
        unidades: [this.receivedData.unidades, Validators.required],
        precio_mayoreo: [this.receivedData.precio_mayoreo, Validators.required],
        cant_mayoreo: [this.receivedData.cant_mayoreo, Validators.required],
    });
    
  }

  async ngOnInit() {

    this.receivedData = this.navParams.get('dataArt');
//    console.log(this.navParams.get('empresa'));

//console.log(this.receivedData)

    if (Number(this.navParams.get('title')) == 1) {
      this.title = 'Crear Registro';
      this.tipoReg = 1;
    } else {
      this.title = 'Actualización';
      this.tipoReg = 2;
    }
    //this.creaFormulario();
  }

  async creaFormulario() {
    if (this.navParams.get('item')) {
      console.log(this.navParams.get('item'))
      this.FormDetArticulo = await this.fb.group({
        cat_articulo: [this.receivedData.cat_articulo, Validators.required],
        cod_articulo: [this.receivedData.cod_articulo, Validators.required],
        cod_det_articulo: [this.receivedData.cod_det_articulo, Validators.required],
        descripcion: [this.receivedData.descripcion, Validators.required],
        precio_venta: [this.receivedData.precio_venta, Validators.required],
        unidades: [this.receivedData.unidades, Validators.required],
        precio_mayoreo: [this.receivedData.precio_mayoreo, Validators.required],
        cant_mayoreo: [this.receivedData.cant_mayoreo, Validators.required],
      });
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm(_true: boolean) {
    return this.modalCtrl.dismiss(_true, 'confirm');
  }

  async add() {
    //console.log(this.FormDetArticulo.value)
    //console.log(this.tipoReg)

    if (this.tipoReg == 1) {
      return await this.modalCtrl.dismiss(this.FormDetArticulo.value, 'confirm');
    } else {
      return await this.actualizarRegistro(this.FormDetArticulo.value);
    }
  }
  
  async actualizarRegistro(data: any) {
    this._articuloService.editarDetArticulo(data).subscribe({
      next: (response) => {
        //this.confirm(true);
        return this.modalCtrl.dismiss(data, 'confirm');
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
