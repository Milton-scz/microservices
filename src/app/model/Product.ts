import { Category } from "./Category";

export class Product {
  id: string;
  name: string;
  description: string;
  stock: number;
  precio: number;
  category: Category;
  image?: string;
  offer?: number;
  descuento?: number;

  constructor(id: string, name: string, description: string, stock: number, precio: number, category: Category, image: string, offer:number, descuento:number) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.stock = stock;
    this.precio = precio;
    this.category = category;
    this.image = image;
    this.offer = offer;
    this.descuento = descuento;
  }
}
