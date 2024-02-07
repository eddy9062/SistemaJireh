import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-activo-actualiza',
  templateUrl: './activo-actualiza.page.html',
  styleUrls: ['./activo-actualiza.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ActivoActualizaPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
