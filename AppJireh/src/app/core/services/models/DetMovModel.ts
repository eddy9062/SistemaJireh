export class DetMovModel {
    constructor(
    public cod_empresa: number,
    public id_operacion: number,
    public item: number,
    public cod_articulo: string,
    public cod_det_articulo: number,
    public cantidad: number,
    public precio: number
    ){}
}