import { DetArticuloModel } from "./DetArticuloModel";

export class ArticuloModel {
    constructor(
    public cod_empresa: number,
    public cat_articulo: number,
    public cod_bodega: number,
    public cod_articulo: string,
    public descripcion: string,
    public existencia: number,
    public precio_compra: number,
    public obs: string,
    public det: DetArticuloModel[]
    )
    {}
}