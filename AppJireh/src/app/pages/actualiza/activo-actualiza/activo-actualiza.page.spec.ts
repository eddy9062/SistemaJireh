import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivoActualizaPage } from './activo-actualiza.page';

describe('ActivoActualizaPage', () => {
  let component: ActivoActualizaPage;
  let fixture: ComponentFixture<ActivoActualizaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ActivoActualizaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
