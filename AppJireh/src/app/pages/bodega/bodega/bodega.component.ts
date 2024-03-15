import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { BodegaService } from 'src/app/core/services/bodega.service';
import { ToastService } from 'src/app/core/services/utils/toast.service';

@Component({
  selector: 'app-bodega',
  templateUrl: './bodega.component.html',
  styleUrls: ['./bodega.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class BodegaComponent  implements OnInit {

  name: string | undefined;
  FormBodega!: FormGroup;
  
  public receivedData: any;
  public title: string | undefined;
  public tipoReg: number | undefined;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private toastService: ToastService,
    private _bodegaService: BodegaService
  ) {
    this.FormBodega = this.fb.group({
      cod_bodega: [''],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
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
      this.FormBodega = await this.fb.group({
        cod_bodega: [this.receivedData.cod_bodega, Validators.required],
        nombre: [this.receivedData.nombre, Validators.required],
        descripcion: [this.receivedData.descripcion, Validators.required],
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
      this.crearRegistro(this.FormBodega.value);
    } else {
      this.actualizarRegistro(this.FormBodega.value);
    }
  }
  
  async actualizarRegistro(data: any) {
    this._bodegaService.editarBodega(data).subscribe({
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
    this._bodegaService.registraBodega(data).subscribe({
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
