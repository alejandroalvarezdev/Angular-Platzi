import { Component } from '@angular/core';
import { Product } from './components/models/product.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
title = 'cursoAngularComponentesyServicios';
lower = 'JKHVHCUHGC7896';
imgParent ="https://i.natgeofe.com/k/6496b566-0510-4e92-84e8-7a0cf04aa505/red-fox-portrait_square.jpg";
img='https://i.natgeofe.com/k/6496b566-0510-4e92-84e8-7a0cf04aa505/red-fox-portrait_square.jpg';

productos:Product[]=[{
  id:1,
  name:"Producto1",
  imagen:"https://img.freepik.com/vector-premium/404-error-no-encontrado-gato-sentado-sosteniendo-enchufe-tomacorriente_626340-65.jpg?w=2000",
  precio:11
},
{
  id:2,
  name:"Producto2",
  imagen:"https://img.freepik.com/vector-premium/404-error-no-encontrado-gato-sentado-sosteniendo-enchufe-tomacorriente_626340-65.jpg?w=2000",
  precio:11
},
{
  id:3,
  name:"Producto3",
  imagen:"https://img.freepik.com/vector-premium/404-error-no-encontrado-gato-sentado-sosteniendo-enchufe-tomacorriente_626340-65.jpg?w=2000",
  precio:11
}]
imgError(imagenError:any){
  this.img = imagenError;
  setTimeout(() => {
    this.img = this.imgParent;
    console.log(this.img);
  }, 5000);
}
tUpper(){
  this.lower.toUpperCase();
}
}
