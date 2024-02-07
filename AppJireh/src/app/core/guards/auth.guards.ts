import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../services/security/session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  
  canActivate() {
    const sessionService = inject(SessionService);
    const router = inject(Router);

    //this._token = this.authService.getToken().value;
    //console.log(this.authService.obtenerToken());

    return sessionService.token().then((resultToken) => {
      //console.log(resultToken);
      if (resultToken == null) {
        router.navigate(['login']);
        //console.log("redirect")
        // return false
      }

      return resultToken == null ? false : true;
    });
  }
}
