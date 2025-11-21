import { Routes } from '@angular/router';
import { Principal } from './principal/principal'
import { Lista } from './lista/lista'
export const routes: Routes = [
    { path: '', component: Principal },
    { path: 'lista', component: Lista }
];
