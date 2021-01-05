import {Component} from '@angular/core';
import {AuthGuard} from '../../services/auth/auth.guard';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  sideNavOptions = [
    {name: 'Home', path: ''},
    {name: 'Profile', path: '/profile', canActivate: [AuthGuard]},
    {name: 'Matcher', path: '/matcher', canActivate: [AuthGuard]}
  ];
  isLoggedIn = false;


  constructor(private router: Router, private auth: AuthService) {
    router.events.subscribe(() => {
      this.isLoggedIn = this.auth.getLoginStatus();
    });
  }
}
