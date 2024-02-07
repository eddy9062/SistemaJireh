import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { CategoriaService } from 'src/app/core/services/categoria.service';
import { EmpresaModel } from 'src/app/core/services/models/EmpresaModel';
import { ToastService } from 'src/app/core/services/utils/toast.service';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class CategoriaComponent  implements OnInit {

  name: string | undefined;
  FormCategoria!: FormGroup;
  
  public receivedData: any;
  public title: string | undefined;
  public tipoReg: number | undefined;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private toastService: ToastService,
    private _bodegaService: CategoriaService
  ) {
    this.FormCategoria = this.fb.group({
      cat_articulo: [''],
      cod_empresa: [this.navParams.get('empresa'), Validators.required],
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
      this.FormCategoria = await this.fb.group({
        cod_empresa: [this.receivedData.cod_empresa, Validators.required],
        cat_articulo: [this.receivedData.cat_articulo, Validators.required],
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
      this.crearRegistro(this.FormCategoria.value);
    } else {
      this.actualizarRegistro(this.FormCategoria.value);
    }
  }
  
  async actualizarRegistro(data: any) {
    this._bodegaService.editarCategoria(data).subscribe({
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
    this._bodegaService.registraCategoria(data).subscribe({
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
