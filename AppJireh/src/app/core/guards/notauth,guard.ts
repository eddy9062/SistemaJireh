import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../services/security/session.service';


@Injectable({
    providedIn: 'root'
  })
export class NotAuthGuard  {
 

  canActivate(){
    const authService = inject(SessionService)
    const router = inject(Router)
    return authService.isLoggedIn()?.then(loggedIn => {
        if (loggedIn) {
          router.navigate(["/"]);
        } 
        return !loggedIn
      }
      );
        
  }
}