import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MenuHomePage } from 'src/app/pages/home/components/menu-home/menu-home.page';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [IonicModule,MenuHomePage,CommonModule],
})
export class HeaderComponent  implements OnInit {

  @Input() titulo: string = '';
  constructor() { }

  ngOnInit() {}

}
