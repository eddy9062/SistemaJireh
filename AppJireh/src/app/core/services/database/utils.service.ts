import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }


  private obtenerValuesParamsTable(obj: any) {
    //return Object.keys(obj).map((e) => `${e} ='${obj[e]}'` ).join(",")
    return Object.keys(obj).map((e) => `?`).join(",")
  }

  private obtenerPropiedadesTable(obj: any) {
    return `(${Object.keys(obj).map((e) => `${e?.toUpperCase()}`).join(",")}) VALUES(${this.obtenerValuesParamsTable(obj)})`
  }

  public obtenerValuesTable(obj: any) {
    return Object.keys(obj).map((e) => obj[e])
  }

  public obtenerInsertSql(nombreTabla: string, values: any) {
    return `INSERT INTO ${nombreTabla} ${this.obtenerPropiedadesTable(values)}`
  }

  public obtenerUpdateSql(nombreTabla: string, obj: any, whereValue?: string){
    return `UPDATE ${nombreTabla} SET ${this.obtenerEntradasUpdate(nombreTabla, obj)} ${whereValue === undefined ? '' : ` Where ${whereValue}`}`;
  }

  private obtenerEntradasUpdate(tabla: string, ot: any){
    return Object.entries(ot).map(([key, value])=>`${key?.toUpperCase()} = ?`).join(", ")
  }

}
