
import { Category } from "./Category";


export class ProductSave {
  id?: string;
  name?: string;
  description?: string;
  stock?: number;
  precio?: number;
  categoryId?: string;
  image?: string;
  offer?: number;
  descuento?: number;


  constructor(name: string, description: string, stock: number, precio: number, categoryId: string, image:string, offer:number, descuento:number) {
    this.name = name;
    this.description = description;
    this.stock = stock;
    this.precio = precio;
    this.categoryId = categoryId;
    this.image = image;
    this.offer = offer;
    this.descuento = descuento;
  }
}
