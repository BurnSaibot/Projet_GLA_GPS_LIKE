import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { InscriptionComponent } from './user/inscription/inscription.component';
import { ConnexionComponent } from './user/connexion/connexion.component';
import { HistoriqueComponent } from './user/historique/historique.component';
import { NavigationComponent } from './navigation/navigation.component';

export const appRoutes: Routes = [
    {
        path: 'inscription', component: UserComponent,
        children: [{ path: '', component: InscriptionComponent }]
    },
    {
        path: 'login', component: UserComponent,
        children: [{ path: '', component: ConnexionComponent }]
    },
    {
        path: 'historique', component: UserComponent,
        children: [{ path: '', component: HistoriqueComponent }]
    },
    {
        path: 'itineraire', component: UserComponent,
        children: [{ path: '', component: NavigationComponent }]
    },
    {
        path: '', redirectTo: '/inscription', pathMatch: 'full'
    }
];