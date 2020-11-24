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
  spinnerDissapears = false;

  /*TODO:
    -fix interceptor for login fail
    -make dialog component
    -matcher
    -route guard
    -password validators
   */
  constructor(private userService: UserService, private auth: AuthService) {
    this.destroy$ = new Subject<boolean>();
  }

  async ngOnInit(): Promise<void> {
    this.currentUser = await this.userService.getCurrentlyLoggedInUserInfo();
    await this.userService.getMatchedUsers().then(matches => {
      this.matchedUsers = matches;
      this.spinnerDissapears = true;
    });
  }

  get userSexualPref(): string {
    return this.currentUser.sexualPref;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
