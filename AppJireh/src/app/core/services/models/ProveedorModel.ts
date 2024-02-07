export class ProveedorModel {
    constructor(
    public cod_empresa: number,
    public cod_proveedor: number,
    public nombre: string,
    public direccion: string,
    public telefono: string,
    public nit: string
    ){}
}