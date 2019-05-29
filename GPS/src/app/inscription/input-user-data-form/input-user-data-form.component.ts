import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'input-user-data-form',
  templateUrl: './input-user-data-form.component.html',
  styleUrls: ['./input-user-data-form.component.css']
})
export class InputUserDataFormComponent implements OnInit {
  inscrit = false;
  valide = false;
  userForm: FormGroup;

  constructor(private formBuilder: FormBuilder) 
  {

  }

  invalidPrenom()
  {
    return (this.valide && this.userForm.controls.first_name.errors != null);  }
  invalidNom()
  {
    return (this.valide && this.userForm.controls.last_name.errors != null);  }

  
  invalidMail()
  {
    return (this.valide && this.userForm.controls.email.errors != null);  

  }
  invalidPwd()
  {
    return (this.valide && this.userForm.controls.password.errors != null); 

  }
  ngOnInit() 
  {
    this.userForm = this.formBuilder.group({
      first_name: ['', Validators.required],
  		last_name: ['', Validators.required],
  		email: ['', [Validators.required, Validators.email]],
  		password: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')]]
  	});
  }

}
