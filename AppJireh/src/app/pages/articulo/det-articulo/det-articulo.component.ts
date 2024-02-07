import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
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
    private _clienteService: ClienteService
  ) {

    this.receivedData = this.navParams.get('dataArt');

    console.log(this.receivedData)

    this.FormDetArticulo = this.fb.group({
        cod_empresa: [this.receivedData.cod_empresa, Validators.required],
        cat_articulo: [this.receivedData.cat_articulo, Validators.required],
        cod_articulo: [this.receivedData.cod_articulo, Validators.required],
        //cod_det_articulo: ['', Validators.required],
        descripcion: [this.receivedData.descripcion, Validators.required],
        precio_venta: [null, Validators.required],
        unidades: [null, Validators.required],
        precio_mayoreo: [null, Validators.required],
        cant_mayoreo: [null, Validators.required],
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
    this.creaFormulario();
  }

  async creaFormulario() {
    if (this.navParams.get('item')) {
      console.log(this.navParams.get('item'))
      this.FormDetArticulo = await this.fb.group({
        cod_empresa: [this.receivedData.cod_empresa, Validators.required],
        cat_articulo: [this.receivedData.cat_articulo, Validators.required],
        cod_articulo: [this.receivedData.cod_articulo, Validators.required],
        descripcion: [this.receivedData.descripcion, Validators.required],
        precio_venta: [null, Validators.required],
        unidades: [null, Validators.required],
        precio_mayoreo: [null, Validators.required],
        cant_mayoreo: [null, Validators.required],
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
    console.log(this.FormDetArticulo)
    return this.modalCtrl.dismiss(this.FormDetArticulo.value, 'confirm');
    /*if (this.tipoReg == 1) {
      this.crearRegistro(this.FormDetArticulo.value);
    } else {
      this.actualizarRegistro(this.FormDetArticulo.value);
    }*/
  }
  
  async actualizarRegistro(data: any) {
    this._clienteService.editarCliente(data).subscribe({
      next: (response) => {
        this.confirm(true);
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
    this._clienteService.registraCliente(data).subscribe({
      next: (response) => {
        this.confirm(true);
      },
      error: (err) => {
        this.toastService.show(`Ocurrio un error ${err.message} `, {
          position: 'bottom',
          duration: 4000,
        });
      },
    }); 
  }
}
