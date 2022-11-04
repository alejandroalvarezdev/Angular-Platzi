import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MainDataService } from '../services/main-data.service';
import { FormControl,FormGroup,FormBuilder } from '@angular/forms';
import { Observable, startWith, Subject } from 'rxjs';
import { map } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field'; '';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css']
})
export class AutocompleteComponent implements OnInit {
title = "autocomplete";
usert : string[]=['a','b','c','mexico','juan','jualio'];
control = new FormControl();
filUs!: Observable<string[]>;
constructor(){}
ngOnInit(): void {
  this.filUs = this.control.valueChanges.pipe(
    startWith(''),
    map(val => this._filter(val))
  );
}

private _filter(val: string): string[]{
const formatVal = val.toLocaleUpperCase();
return this.usert.filter(u => u.toLocaleLowerCase().indexOf(formatVal) === 0);
  }
}


