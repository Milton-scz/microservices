import { Almacen } from "./Almacen";
import { Category } from "./Category";
import { Product } from "./Product";

export class AjusteInventario {
  id: string;
  product: Product;
  almacen: Almacen;
  tipo: number;
  cantidad: number;
  glosa: string;


  constructor(id: string, product: Product, almacen: Almacen, tipo: number, cantidad: number,  glosa: string) {
    this.id = id;
    this.product = product;
    this.almacen = almacen;
    this.tipo = tipo;
    this.cantidad = cantidad;
    this.glosa = glosa;
  }
}
