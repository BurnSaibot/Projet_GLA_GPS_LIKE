import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AlertModule } from 'ngx-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { appRoutes } from './routes';
import {
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatGridListModule,
  MatCardModule,
  MatMenuModule
} from '@angular/material';
import { InscriptionComponent } from './user/inscription/inscription.component';
import { HistoriqueComponent } from './user/historique/historique.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ConnexionComponent } from './user/connexion/connexion.component';
import { OptionsComponent } from './options/options.component';
import { UserComponent } from './user/user.component';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { UserProfileComponent } from './user-profile/user-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    InscriptionComponent,
    HistoriqueComponent,
    NavigationComponent,
    ConnexionComponent,
    OptionsComponent,
    UserComponent,
    UserProfileComponent
  ],
  imports: [
    AlertModule.forRoot(),
    BrowserModule,
    HttpClientModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [
    AppComponent, 
    InscriptionComponent, 
    UserComponent
  ]
})
export class AppModule 
{

}
