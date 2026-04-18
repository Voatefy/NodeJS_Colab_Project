import { Routes } from '@angular/router';
import { Bilan } from './features/bilan/bilan';
import { Login } from './features/auth/login/login';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'bilan', component: Bilan },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];