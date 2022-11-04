import { Injectable } from '@angular/core';
import { Product } from '../components/models/product.model';
import {HttpClient} from '@angular/common/http'
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MainDataService {
  baseURL ='https://api.escuelajs.co/api/v1/products';
  baseUsersURL ='https://api.escuelajs.co/api/v1/users'
  constructor(private http:HttpClient) { }
  ////// Products
  carrito:Product[]=[];
  productos:Product[]=[{
    id:1,
    name:"Producto1",
    imagen:"https://img.freepik.com/vector-premium/404-error-no-encontrado-gato-sentado-sosteniendo-enchufe-tomacorriente_626340-65.jpg?w=2000",
    precio:1156
  },
  {
    id:2,
    name:"Producto2",
    imagen:"https://img.freepik.com/vector-premium/404-error-no-encontrado-gato-sentado-sosteniendo-enchufe-tomacorriente_626340-65.jpg?w=2000",
    precio:123
  },
  {
    id:3,
    name:"Producto3",
    imagen:"https://img.freepik.com/vector-premium/404-error-no-encontrado-gato-sentado-sosteniendo-enchufe-tomacorriente_626340-65.jpg?w=2000",
    precio:1185
  }]
  productosResponse=[];
////
getUsers():Observable<any>{
  return this.http.get(this.baseUsersURL);
}

/////////
  getProductsAPI():Observable<any>{
    return this.http.get(this.baseURL);
  }
  addProduct(producto:Product){
    this.carrito.push(producto);
  }
  getTotal(){
  return this.carrito.reduce((sum,item)=>sum+item.precio,0);
  }
  getCart(){
    return this.carrito;
  }
  getProducts(){
    return this.productos;
  }
/////
}
