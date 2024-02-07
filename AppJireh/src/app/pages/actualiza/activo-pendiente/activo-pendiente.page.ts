import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivosService } from 'src/app/core/services/activos.service';
import { error } from 'console';

@Component({
  selector: 'app-activo-pendiente',
  templateUrl: './activo-pendiente.page.html',
  styleUrls: ['./activo-pendiente.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ActivoPendientePage implements OnInit {

  constructor(private _activoService : ActivosService) { }

  ngOnInit() {
    this.descargarListActivos();
  }

  async descargarListActivos(
  ){
    let result = await this._activoService.obtenerCheckListData().catch(error =>{
      console.log(error)
    })
    console.log(result)
  }

}
