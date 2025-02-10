

export class AjusteInventarioDto {

  productId: string;
  almacenId: string;
  tipo: number;
  cantidad: number;
  glosa: string;


  constructor( productId: string, almacenId: string, tipo: number, cantidad: number,  glosa: string) {

    this.productId = productId;
    this.almacenId = almacenId;
    this.tipo = tipo;
    this.cantidad = cantidad;
    this.glosa = glosa;
  }
}
