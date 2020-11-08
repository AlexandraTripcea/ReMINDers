import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-matcher',
  templateUrl: './matcher.component.html',
  styleUrls: ['./matcher.component.scss']
})
export class MatcherComponent implements OnInit {
  users = [];
  path = '/users';

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.getFromFirestore(this.path).subscribe(list => this.users = list);
  }

}
