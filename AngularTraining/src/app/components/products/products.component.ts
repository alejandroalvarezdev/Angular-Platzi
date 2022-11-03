import { MainDataService } from './../../services/main-data.service';
import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  carrito:Product[];
  carritoAPI:Array<any>=[];
  productos:Product[]=[];
  productosAPI:any;
  total =0;
  constructor(private productoService:MainDataService) {
    this.carrito = this.productoService.getCart();
    this.productos = this.productoService.getProducts();
  }

  ngOnInit(): void {
    this.productoService.getProductsAPI().subscribe((resp:any)=>{
      this.carritoAPI = resp;
      console.log(this.carritoAPI);

    })

  }


  onProductAdd(producto:Product){
    this.productoService.addProduct(producto);
    this.total = this.productoService.getTotal();
  }



}
