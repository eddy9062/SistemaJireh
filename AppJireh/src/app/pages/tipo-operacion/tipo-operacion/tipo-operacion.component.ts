import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { BodegaService } from 'src/app/core/services/bodega.service';
import { EmpresaModel } from 'src/app/core/services/models/EmpresaModel';
import { ToastService } from 'src/app/core/services/utils/toast.service';

@Component({
  selector: 'app-tipo-operacion',
  templateUrl: './tipo-operacion.component.html',
  styleUrls: ['./tipo-operacion.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class TipoOperacionComponent  implements OnInit {

  
  name: string | undefined;
  FormTipoOpera!: FormGroup;
  public _listEmpresa: EmpresaModel[] | undefined;
  public receivedData: any;
  public title: string | undefined;
  public tipoReg: number | undefined;

  
  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private toastService: ToastService,
    private _tipoOpService: BodegaService
  ) {
    this.FormTipoOpera = this.fb.group({
      cod_tipo: [''],
      des_tipo: ['', Validators.required],
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
      this.FormTipoOpera = await this.fb.group({
        cod_tipo: [this.receivedData.cod_tipo, Validators.required],
        des_tipo: [this.receivedData.des_tipo, Validators.required],
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
      this.crearRegistro(this.FormTipoOpera.value);
    } else {
      this.actualizarRegistro(this.FormTipoOpera.value);
    }
  }
  
  async actualizarRegistro(data: any) {
    this._tipoOpService.editarTipOperacion(data).subscribe({
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
    this._tipoOpService.registraTipOperacion(data).subscribe({
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
