import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonModal, IonicModule, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/security/auth.service';
import { SessionService } from 'src/app/core/services/security/session.service';
import { LoadingService } from 'src/app/core/services/utils/loading.service';
import { ToastService } from 'src/app/core/services/utils/toast.service';
import { UtilsPlataformaService } from 'src/app/core/services/utils/utils-plataforma.service';
import { App } from '@capacitor/app';
import { environment } from 'src/environments/environment';
import { Device } from '@capacitor/device';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule,HttpClientModule],providers: [
    HttpClientModule
  ]
})
export class LoginPage implements OnInit {

  private subscriptionNetwork: Subscription | undefined
  private subscriptionUser: Subscription | undefined
  private subscriptionJwt: Subscription | undefined
  public loginForm!: FormGroup
  public tipoRedStr = "Red (Datos)"
  public tituloErrores: string = "Errores"
  public errores: Array<any> = []

  public appVersionStr?: string;
  public appName: string = "";
  public showButton = true;

  @ViewChild("ionModal") modal: IonModal | undefined;
  
  constructor(
    private fb: FormBuilder,
    private sessionService: SessionService,
    private loadingService: LoadingService,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    public platform: Platform,
    public utilsPlatform: UtilsPlataformaService
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      usuario: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required]),
      red: new FormControl(false),
      recuerdame: new FormControl(true)
    })

    this.subscriptionUser = this.sessionService.usuarioSub().subscribe({
      next: (result) => {
        //console.log(result)
        if (result) {
          this.recuerdame?.setValue(true)
          this.usuario?.setValue(result.usuario)
          this.password?.setValue(result.password)
        }
      }
    })

    this.subscriptionNetwork = this.sessionService.redSeleccionadaSub().subscribe({
      next: (result) => {
        let redResult = result == null || !result ? false : true;
        if (!redResult) {
          this.tipoRedStr = "Red (Datos)";
        } else {
          this.tipoRedStr = "Red Local"
        }
        this.red?.setValue(redResult)
      }
    })
  }

  get usuario() { return this.loginForm?.get("usuario") }
  get password() { return this.loginForm.get("password") }
  get red() { return this.loginForm.get("red") }
  get recuerdame() { return this.loginForm.get("recuerdame") }



  async login() {
    const info = await Device.getInfo();
    this.loadingService.loading("Iniciando sesión, espere...",
      this.authService.login(this.recuerdame?.value, {
        usuario: this.usuario?.value,
        password: this.password?.value,
        os: info.operatingSystem,
        osVersion: info.osVersion,
        model: info.model,
        platform: info.platform        
      })).subscribe({
        next: (res: any) => {
          //console.log(res)
          if(res ==undefined || res.message =='fail'){
            this.toastService.show('El usuario o ontraseña no coinciden...')
          }else{
            this.router.navigateByUrl("/");
          }
        },
        error: (errResult: any) => {
          if (errResult?.error?.codigo_respuesta == 403) {
            if (Array.isArray(errResult.error.errores) && errResult.error.errores.length > 0) {
              this.tituloErrores = errResult.error.mensaje || "Errores"
              this.errores = errResult.error.errores
              this.modal?.present()
            } else {
              this.toastService.show(`Ocurrio un error ${errResult.message} `, {
                position: 'bottom',
                duration: 4000
              })
            }
          } else {
            this.toastService.show(`Ocurrio un error ${errResult.message} `, {
              position: 'bottom',
              duration: 4000
            })
          }

        }
      })
  }


  cambioRed($event: any) {
    this.sessionService.setRedSeleccionada($event.detail.checked)
  }


  ngOnDestroy(): void {
    this.subscriptionNetwork?.unsubscribe()
    this.subscriptionUser?.unsubscribe()
    this.subscriptionJwt?.unsubscribe()
  }

  ngAfterViewInit() {
    if (this.utilsPlatform.isNativePlatform()) {
      App.getInfo().then(info => {
        this.appVersionStr = info.version
        this.appName = info.name
      });
    } else {
      this.appVersionStr = environment.version
    }

  }
}
