import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Product} from'../models/product.model';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  @Input() product:Product={
    id: 0,
    name: '',
    imagen: '',
    precio: 0
  };
  @Output() addProduct = new EventEmitter<Product>();

  constructor() { }

  ngOnInit(): void {
  }
  add2Cart(){
    this.addProduct.emit(this.product)
  }

}
