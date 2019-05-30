import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../../shared/user.service';
import { NgForm } from '@angular/forms';
//import { User } from '../../shared/user';


@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css'],
  providers: [UserService]
})
export class InscriptionComponent implements OnInit {
  showSucessMessage: boolean;
  serverErrorMessages: string;
  onSubmit (form: NgForm) {
    this.userService.postUser(form.value).subscribe(
      res => {
        this.showSucessMessage = true;
        setTimeout(() => this.showSucessMessage = false, 4000);
        this.resetForm(form);
      },
      err => {
        if (err.status === 422) {
          this.serverErrorMessages = err.error.join('<br/>');
        }
        else
          this.serverErrorMessages = 'Contactez un administrateur';
      }
    );
  }
  resetForm(form: NgForm) {
    this.userService.selectedUser = {
      nom: '',
      prenom: '',
      mail: '',
      password: ''
    };
    form.resetForm();
    this.serverErrorMessages = '';
  }
  mailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  constructor(private userService: UserService) {}
  ngOnInit()
  {}  
}
