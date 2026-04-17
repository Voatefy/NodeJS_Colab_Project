import { Routes } from '@angular/router';
import { Bilan } from './features/bilan/bilan';

export const routes: Routes = [
  { path: 'bilan', component: Bilan },
  { path: '', redirectTo: 'bilan', pathMatch: 'full' }
];