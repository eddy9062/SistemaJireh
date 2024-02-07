import { APP_INITIALIZER, enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptors, withInterceptorsFromDi, withRequestsMadeViaParent } from '@angular/common/http';
import { Capacitor } from '@capacitor/core';
import { defineCustomElements as jeepSqlite } from 'jeep-sqlite/loader';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { SQLiteService } from './app/core/services/database/sqlite.service';
import { DatabaseService } from './app/core/services/database/database.service';
import { DetailService } from './app/core/services/database/detail.service';
import { InitializeAppService } from './app/core/services/database/initialize.app.service';
import { MigrationService } from './app/core/services/database/migration.service';
import { LoadingService } from './app/core/services/utils/loading.service';

if (environment.production) {
  enableProdMode();
}

jeepSqlite(window);

export function initializeFactory(init: InitializeAppService) {
  return () => init.initializeApp();
}


window.addEventListener('DOMContentLoaded', async () => {
  const platform = Capacitor.getPlatform();
  const sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite)
  try {
    if (platform === "web") {
      //console.log('in index.ts')
      const jeepEl = document.createElement("jeep-sqlite");
      document.body.appendChild(jeepEl);
      await customElements.whenDefined('jeep-sqlite');
      //console.log('in index.ts after customElements')
      await sqlite.initWebStore();
      console.log('after sqlite.initWebStore()');
    }
    await sqlite.checkConnectionsConsistency();

    bootstrapApplication(AppComponent, {
      providers: [
        SQLiteService,
        DetailService,
        DatabaseService,
        InitializeAppService,
        MigrationService,
        LoadingService,
        {
          provide: APP_INITIALIZER,
          useFactory: initializeFactory,
          deps: [InitializeAppService],
          multi: true
        },

        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },

        /*provideHttpClient(
          withInterceptors([LoadingInterceptor])
        ),*/
        importProvidersFrom(IonicModule.forRoot({}), HttpClientModule),
        provideRouter(routes),
        /*provideHttpClient(
          withInterceptors([
            loadingInterceptor
          ])
        ),*/
      ],
    });


  } catch (err) {
    console.log(`Error: ${err}`);
    throw new Error(`Error: ${err}`)
  }

});
