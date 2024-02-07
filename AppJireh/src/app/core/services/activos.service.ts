import { Injectable } from '@angular/core';
import { DatabaseService } from './database/database.service';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root'
})
export class ActivosService {

  constructor(private dataBaseService: DatabaseService,) { }


  public obtenerCheckListData() {
    let nombreTabla = 'AF_ACTIVO';
    return this.dataBaseService.executeQuery<any>((db: SQLiteDBConnection) => {
      return this.dataBaseService.select({ tableName: nombreTabla }, db);
    });
  }

  
}
