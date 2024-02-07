import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { ToastService } from 'src/app/core/services/utils/toast.service';
import { ClienteService } from 'src/app/core/services/cliente.service';


@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class ClienteComponent implements OnInit {
  name: string | undefined;
  FormCliente!: FormGroup;
  
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
    this.FormCliente = this.fb.group({
      cod_cliente: [''],
      cod_empresa: [this.navParams.get('empresa'), Validators.required],
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      nit: ['', Validators.required],
    });
    
  }

  async ngOnInit() {

    this.receivedData = this.navParams.get('item');
//    console.log(this.navParams.get('empresa'));

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
      this.FormCliente = await this.fb.group({
        cod_empresa: [this.receivedData.cod_empresa, Validators.required],
        cod_cliente: [this.receivedData.cod_cliente, Validators.required],
        nombre: [this.receivedData.nombre, Validators.required],
        direccion: [this.receivedData.direccion, Validators.required],
        telefono: [this.receivedData.telefono, Validators.required],
        nit: [this.receivedData.nit, Validators.required],
      });
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm(_true: boolean) {
    return this.modalCtrl.dismiss(_true, 'confirm');
  }

  async guardar() {
    if (this.tipoReg == 1) {
      this.crearRegistro(this.FormCliente.value);
    } else {
      this.actualizarRegistro(this.FormCliente.value);
    }
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
