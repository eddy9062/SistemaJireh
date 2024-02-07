import { Injectable } from '@angular/core';
import { MigrationService } from './migration.service';
import { SQLiteService } from './sqlite.service';

@Injectable()
export class InitializeAppService {

  constructor(
    private sqliteService: SQLiteService,
    private migrationService: MigrationService) { }

  async initializeApp() {
    await this.sqliteService.initializePlugin().then(async (ret) => {
      try {
                await this.migrationService.migrate();

                console.log("Migracion completada...");
                

      } catch (error) {
        throw Error(`initializeAppError: ${error}`);
      }

    });
  }

}
