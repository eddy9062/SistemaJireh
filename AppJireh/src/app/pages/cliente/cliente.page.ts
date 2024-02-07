import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonList, IonicModule, ModalController } from '@ionic/angular';
import { HeaderComponent } from 'src/app/component/header/header.component';
import { Router } from '@angular/router';
import { ClienteModel } from 'src/app/core/services/models/ClienteModel';
import { LoadingService } from 'src/app/core/services/utils/loading.service';
import { ToastService } from 'src/app/core/services/utils/toast.service';
import { ClienteComponent } from './cliente/cliente.component';
import { FiltroPipe } from 'src/app/component/pipes/filtro.pipe';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { SessionService } from 'src/app/core/services/security/session.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
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
export class ClientePage implements OnInit {
  public _listCliente: ClienteModel[] = [];
  _textoBuscar: string = '';
  public _empresa: any;

  @ViewChild(IonList) ionList: IonList | undefined;

  constructor(
    private sessionService: SessionService,
    private _clienteService: ClienteService,
    private loadingService: LoadingService,
    private router: Router,
    private toastService: ToastService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit(): void {
    this.sessionService.getEmpresa()?.subscribe((empre) => {
      this._empresa = empre;
      this.getClientes();
    });
  }

  public redirect(menu: any) {
    this.router.navigate([menu.url]);
  }

  onSearch(event: any) {
    this._textoBuscar = event.detail.value;
  }

  RemoveItem(empresa: number, key: number) {
    this._listCliente.forEach((value, index) => {
      if (value.cod_empresa == empresa && value.cod_cliente == key)
        this._listCliente.splice(index, 1);
    });
  }

  public getClientes() {
    this.loadingService
      .loading('Cargando información...', this._clienteService.getClientes())
      .subscribe({
        next: (response) => {
          console.table(response);
          this._listCliente = response as unknown as Array<ClienteModel>;
        },
        error: (err) => {
          if (err.status == 403) {
            this.toastService.show(err.error.message, {
              position: 'bottom',
              duration: 3000,
            });
            this.sessionService.logOut();
          } else {
            this.toastService.show(`Ocurrio un error ${err.message} `, {
              position: 'bottom',
              duration: 3000,
            });
          }
        },
        
      });
  }

  async onUpdate(item?: ClienteModel) {
    const title = 2;
    const modal = await this.modalCtrl.create({
      component: ClienteComponent,
      componentProps: {
        item,
        title,
      },
    });
    modal.onDidDismiss().then((item) => {
      // Puedes manejar la respuesta del modal aquí si es necesario
      //console.log(item)
      this.ionList?.closeSlidingItems();
      if (item.data) {
        this.getClientes();
        this.toastService.show('Registro Acutalizado', {
          position: 'middle',
          duration: 2000,
        });
      }
    });
    await modal.present();
  }

  async creaCliente() {
    const title = 1;
    const empresa = this._empresa;
    console.log(empresa);
    const modal = await this.modalCtrl.create({
      component: ClienteComponent,
      componentProps: {
        title,
        empresa,
      },
    });
    modal.onDidDismiss().then((item) => {
      this.ionList?.closeSlidingItems();
      if (item.data) {
        this.getClientes();
        this.toastService.show('Registro creado', {
          position: 'middle',
          duration: 2000,
        });
      }
    });
    await modal.present();
  }

  onDelete(item: ClienteModel, idx: number) {
    console.log(idx);
    this._clienteService.deleteCliente(item).subscribe({
      next: (response) => {
        this.ionList?.closeSlidingItems();
        this.RemoveItem(item.cod_empresa, item.cod_cliente);
        console.log(response);
        this.toastService.show('Registro eliminado', {
          position: 'middle',
          duration: 2000,
        });
      },
      error: (err) => {
        /*console.log(err)
        console.log(err.error)
        console.log(err.error.message)*/
        this.toastService.show(`Ocurrio un error ${err.error.message} `, {
          position: 'bottom',
          duration: 4000,
        });
      },
    });
  }
}
