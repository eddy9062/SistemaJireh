import { Injectable } from '@angular/core';
import { DBSQLiteValues, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { environment } from 'src/environments/environment';
import { SQLiteService } from './sqlite.service';
import { UtilsService } from './utils.service';

interface SQLiteDBConnectionCallback<T> { (myArguments: SQLiteDBConnection): T }

@Injectable()
export class DatabaseService {

  constructor(
    private sqlite: SQLiteService,
    //private _dataBaseService: DatabaseService,
    private utils: UtilsService) {

  }


  /**
   * this function will handle the sqlite isopen and isclosed automatically for you.
   * @param callback: The callback function that will execute multiple SQLiteDBConnection commands or other stuff.
   * @param databaseName optional another database name
   * @returns any type you want to receive from the callback function.
   */
  async executeQuery<T>(callback: SQLiteDBConnectionCallback<T>, databaseName: string = environment.databaseName): Promise<T> {
    try {
      let isConnection = await this.sqlite.isConnection(databaseName);

      if (isConnection.result) {
        let db = await this.sqlite.retrieveConnection(databaseName);
        return await callback(db);
      }
      else {
        const db = await this.sqlite.createConnection(databaseName, false, "no-encryption", environment.databaseVersion);

        await db.open();
        let cb = await callback(db);

        await this.sqlite.closeConnection(databaseName);


        return cb;
      }
      //throw Error(`succesfull`);
    } catch (error) {
      throw Error(`DatabaseServiceError: ${error}`);
    }
  }

  async addUpgradeStatement<T>(version: number, statements: string[], databaseName: string = environment.databaseName): Promise<void> {
    try {
      await this.sqlite.addUpgradeStatement(databaseName, version, statements);
      return Promise.resolve()
    } catch (error) {

      return Promise.reject(Error(`DatabaseServiceError: ${error}`))
    }
  }



  public async insert(
    params: {
      nombreTabla: string,
      obj: any,
      error: string,
    }, db: SQLiteDBConnection) {
    let sqlcmd: string = this.utils.obtenerInsertSql(params.nombreTabla, params.obj)
    let values: Array<any> = this.utils.obtenerValuesTable(params.obj)
    let ret: any = await db.run(sqlcmd, values)
    if (ret.changes.lastId > 0) {
      return ret.changes
    }
    throw Error(params.error)
  }

  public delete(
    params: {
      tableName: string,
      where?: string
    },
    db: SQLiteDBConnection
  ) { return db.query(`Delete From ${params.tableName} ${(params.where ? `Where ${params.where}` : ``)}`) }



  public async select(
    params: {
      tableName: string,
      where?: string,
      order?: string,
      values?: any[]
    },
    db: SQLiteDBConnection) {
    var resultData: DBSQLiteValues = await db.query(`Select * From ${params.tableName} ${(params.where ? `Where ${params.where}` : ``)} ${params.order ? ` Order by ${params.order}` : ``}`, params.values)
    return resultData.values
  }


  public async selectQuery(params: { query: string, values?: any[] }, db: SQLiteDBConnection) {
    var resultData: DBSQLiteValues = await db.query(params.query, params.values)
    return resultData.values
  }


  public async update(params: {
    nombreTabla: string,
    obj: any,
    error: string,
    whereValues?: string
  }, db: SQLiteDBConnection) {
    let query = this.utils.obtenerUpdateSql(params.nombreTabla, params.obj, params.whereValues)
    let values: Array<any> = this.utils.obtenerValuesTable(params.obj)
    let result: any = await db.query(query, values)
    console.log(result);

    if (result.changes.changes > 0) {
      return result.changes
    }
    throw Error(params.error)
  }







}
