import {Component, Input, ViewChild} from '@angular/core';
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
    {name: 'Home', path: '', img: 'home'},
    {name: 'Profile', path: '/profile', img: 'person', canActivate: [AuthGuard]},
    {name: 'Matcher', path: '/matcher', img: 'favorite_border', canActivate: [AuthGuard]}
  ];
  isLoggedIn = false;

  constructor(private router: Router, private auth: AuthService) {
    router.events.subscribe(() => {
      this.isLoggedIn = this.auth.getLoginStatus();
    });
  }

  signUserOut(): void {
    this.auth.signUserOut();
  }
}
