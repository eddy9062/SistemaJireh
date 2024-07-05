import { DetMovModel } from "./DetMovModel";

export class MovModel {
    constructor(
    public cod_empresa: number,
    public tipo_operacion: string,
    public id_operacion: number,
    public fecha: string,
    public nit: string,
    public det: DetMovModel[]
    ){}
}