import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MainDataService } from '../services/main-data.service';
import { FormControl,FormGroup,FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css']
})
export class AutocompleteComponent implements OnInit {
users:Array<any> =[];
  formAutocomplete!: FormGroup;
  constructor(private mainService:MainDataService, private fb:FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
    this.mainService.getUsers().subscribe((resp:any)=>{
      this.users = resp;
      console.log(this.users);
    })

  }
  initForm(){
    this.formAutocomplete = this.fb.group({
      'employee':[''],
    })
    this.formAutocomplete.get('employee')?.valueChanges.subscribe((res:any)=>{
      console.log('data',res);

      this.filterData(res);
    })

  }
  filterData(enteredData:any){

  }


}
