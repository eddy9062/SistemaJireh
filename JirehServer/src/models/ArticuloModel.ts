import { DetArticuloModel } from "./DetArticuloModel";

export class ArticuloModel {
    constructor(
    public cat_articulo: number,
    public cod_articulo: string,
    public descripcion: string,
    public obs: string,
    public det: DetArticuloModel[]
    )
    {}
}