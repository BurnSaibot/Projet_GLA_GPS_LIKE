import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../../shared/user.service';
//import { User } from '../../shared/user';


@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css'],
  providers: [UserService]
})
export class InscriptionComponent implements OnInit {


  constructor(private userService: UserService) {}
  ngOnInit()
  {}  
}
