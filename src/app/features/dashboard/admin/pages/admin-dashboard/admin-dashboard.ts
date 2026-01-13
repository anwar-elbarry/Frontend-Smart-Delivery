import { Component } from '@angular/core';
import {Sidebar} from '../../../../../core/layout/sidebar/sidebar';
import {RouterOutlet} from '@angular/router';
import {Header} from '../../../../../core/layout/header/header';

@Component({
  selector: 'app-admin-dashboard',
  imports: [Sidebar, RouterOutlet, Header],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {

}
