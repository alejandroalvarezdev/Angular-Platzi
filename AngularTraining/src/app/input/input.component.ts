import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

@Input() imagen='';
@Output() error404 = new EventEmitter();
cat404='https://img.freepik.com/vector-premium/404-error-no-encontrado-gato-sentado-sosteniendo-enchufe-tomacorriente_626340-65.jpg?w=2000';
flag=false;
  constructor() { }

  ngOnInit(): void {
  }
  errorImage(){

    alert("ups Algo ha sucedido");
    this.error404.emit(this.cat404)
  }

}
