import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  navbarOptions = [
    {name: 'Home', path: ''},
    {name: 'Login', path: 'login'},
    {name: 'Register', path: 'register'},
    {name: 'Profile', path: '/profile'},
    {name: 'Matcher', path: '/matcher'}
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

}
