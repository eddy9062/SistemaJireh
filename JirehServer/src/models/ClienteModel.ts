export class ClienteModel {
    constructor(
    public cod_empresa: number,
    public cod_cliente: number,
    public nombre: string,
    public direccion: string,
    public telefono: string,
    public nit: string
    ){}
}