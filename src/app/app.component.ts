import {Component} from '@angular/core';
import {AuthGuard} from './services/auth/auth.guard';
import {BehaviorSubject} from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isLoggedIn$: BehaviorSubject<boolean>;

  constructor() {
    this.isLoggedIn$ = new BehaviorSubject(false);
  }

  sideNavOptions = [
    {name: 'Home', path: ''},
    {name: 'Profile', path: '/profile', canActivate: [AuthGuard]},
    {name: 'Matcher', path: '/matcher', canActivate: [AuthGuard]}
  ];

  isLoggedIn(): void {
    console.log(this.isLoggedIn$.getValue());
    if (JSON.parse(localStorage.getItem('loggedInUser')).uid) {
      this.isLoggedIn$.next(true);
    }
    this.isLoggedIn$.next(false);
  }
}
