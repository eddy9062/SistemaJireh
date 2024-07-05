export class ArticuloMovModel {
    constructor(
    public cod_empresa: number,
    public cod_articulo: string,
    public cod_det_articulo: number,
    public descripcion: string,
    public existencia: number,
    public precio_venta: number
    ){}

}