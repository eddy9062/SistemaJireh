import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { ProveedorService } from 'src/app/core/services/proveedor.service';
import { ToastService } from 'src/app/core/services/utils/toast.service';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class ProveedorComponent  implements OnInit {

  name: string | undefined;
  FormProveedor!: FormGroup;
  
  public receivedData: any;
  public title: string | undefined;
  public tipoReg: number | undefined;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private toastService: ToastService,
    private _proveedorService: ProveedorService
  ) {
    this.FormProveedor = this.fb.group({
      cod_proveedor: [''],
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
      //console.log(this.navParams.get('item'))
      this.FormProveedor = await this.fb.group({
        cod_empresa: [this.receivedData.cod_empresa, Validators.required],
        cod_proveedor: [this.receivedData.cod_proveedor, Validators.required],
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
      this.crearRegistro(this.FormProveedor.value);
    } else {
      this.actualizarRegistro(this.FormProveedor.value);
    }
  }
  
  async actualizarRegistro(data: any) {
    this._proveedorService.editarProveedor(data).subscribe({
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
    this._proveedorService.registraProveedor(data).subscribe({
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
