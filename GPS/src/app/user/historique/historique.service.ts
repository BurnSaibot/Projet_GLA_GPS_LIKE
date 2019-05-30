
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import { environment } from 'src/environments/environment';

@Injectable()
export class HistoriqueService {
  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }
    getHistorique()
    {
      return this.http.get(environment.api + 'itineraire');
    }
  
}
