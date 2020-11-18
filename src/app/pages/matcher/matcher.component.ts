import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../services/user/user.service';
import {AuthService} from '../../services/auth/auth.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-matcher',
  templateUrl: './matcher.component.html',
  styleUrls: ['./matcher.component.scss']
})
export class MatcherComponent implements OnInit, OnDestroy {
  users = [];
  path = '/users';
  private currentUser: any;
  matchedUsers = [];
  private destroy$: Subject<boolean>;

  /*TODO:
    -fix interceptor for login fail
    -make dialog component
    -localStorage -> sessionStorage
    -matcher
   */
  constructor(private userService: UserService, private auth: AuthService) {
    this.destroy$ = new Subject<boolean>();
  }

  async ngOnInit(): Promise<void> {
    this.userService.getFromFirestore(this.path).pipe(takeUntil(this.destroy$)).subscribe(list => this.users = list);
    await this.userService.getMatchedUsers().then(matches => this.matchedUsers = matches);
    console.log(this.matchedUsers);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
