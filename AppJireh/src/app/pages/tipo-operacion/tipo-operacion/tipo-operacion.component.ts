import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
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
        private toastService: ToastService
  ) {
    this.FormTipoOpera = this.fb.group({
      id: [''],
      //id_empresa: [this.pbService.getInstance().authStore.model?.['id_empresa'], Validators.required],
      des_tipo: ['', Validators.required],
    })
  }

  async ngOnInit() {
    //console.log(this.pbService.getEmpresa())
    //this.getEmpresa();
    this.receivedData = this.navParams.get('item');

    console.log(this.navParams.get('item'))

    if (Number(this.navParams.get('title')) == 1) {
      this.title = 'Crear Registro';
      this.tipoReg = 1;
    } else {
      this.title = 'Actualización';
      this.tipoReg = 2;
    }
    this.creaFormulario()
  }

  async creaFormulario() {
    if (this.navParams.get('item')) {
      this.FormTipoOpera = await this.fb.group({
        id: [this.receivedData.id, Validators.required],
       // id_empresa: [this.pbService.getInstance().authStore.model?.['id_empresa'], Validators.required],
        des_tipo: [this.receivedData.nombre, Validators.required],
      });
    }
  }
  guardar() {
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

/*  confirm(_true: boolean) {
    return this.modalCtrl.dismiss(_true, 'confirm');
  }

  public async getEmpresa() {
    await this.pbService
      .getListEmpresa()
      .then((result) => {
        console.log(result);
        this._listEmpresa = result as unknown as Array<EmpresaModel>;
      })
      .catch((err) => {
        this.toastService.show(`Ocurrio un error ${err.message} `, {
          position: 'bottom',
          duration: 4000,
        });
      });
  }

  async guardar() {
    console.log(this.FormTipoOpera)
    console.log(this.FormTipoOpera.value)
    if (this.FormTipoOpera.invalid) {
      console.log('dsdsdsd')
    }
    if (this.tipoReg == 1) {
      this.crearRegistro(this.FormTipoOpera);
    } else {
      this.actualizarRegistro(this.FormTipoOpera);
    }
  }

  async actualizarRegistro(data: any) {
    await this.pbService
      .updateTipoOpera(this.FormTipoOpera?.value.id, data.value)
      .then((result) => {
        console.log(result);
        this.confirm(true);
      })
      .catch((err) => {
        this.toastService.show(`Ocurrio un error ${err.message} `, {
          position: 'bottom',
          duration: 4000,
        });
      });
  }
  async crearRegistro(data: any) {
    await this.pbService
      .creaTipoOpera(data.value)
      .then((result) => {
        console.log(result);
        this.confirm(true);
      })
      .catch((err) => {
        this.toastService.show(`Ocurrio un error ${err.message} `, {
          position: 'bottom',
          duration: 4000,
        });
      });
  }*/

  crearRegistro(data: any) {

  }

  
}
