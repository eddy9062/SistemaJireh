export class DetArticuloModel {
    constructor(
        public cat_articulo: number,
        public cod_articulo: string,
        public descripcion: string,
        public precio_venta: number,
        public unidades: number,
        public cant_mayoreo: number,
        public precio_mayoreo: number
    ){}
}