export class DetMovModel {
    constructor(
    public item: number,
    public cod_articulo: string,
    public cod_det_articulo: number,
    public descripcion: string,
    public cantidad: number,
    public precio: number
    ){}
}