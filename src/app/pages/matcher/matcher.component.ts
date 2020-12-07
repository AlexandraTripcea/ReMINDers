import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../services/user/user.service';
import {Subject} from 'rxjs';
import {fader, sliderNpopper} from '../../../animations';

import $ from 'jquery';

declare var $: $;

@Component({
  selector: 'app-matcher',
  templateUrl: './matcher.component.html',
  styleUrls: ['./matcher.component.scss'],
  animations: [sliderNpopper, fader],
})
export class MatcherComponent implements OnInit, OnDestroy {
  matchedUserCounter = 0;
  users = [];
  path = '/users';
  private currentUser: any;
  matchedUsers = [];
  private destroy$: Subject<boolean>;
  spinnerDissapears = false;
  currentMatchedUser: any;
  changeDetectorRef: ChangeDetectorRef;
  animationState = 'slider';

  /*TODO:
    -password validators
    -check wtf is jwt
    -profile (setting/editing, seeing other people, additional info)
    -drawer/sidebar
    -questions
    -chat
    -UI and responsive
   */
  constructor(private userService: UserService, changeDetectorRef: ChangeDetectorRef) {
    this.changeDetectorRef = changeDetectorRef;
    this.destroy$ = new Subject<boolean>();
  }

  async ngOnInit(): Promise<void> {
    this.currentUser = await this.userService.getCurrentlyLoggedInUserInfo();
    await this.userService.getMatchedUsers().then(matches => {
      this.matchedUsers = matches;
      this.spinnerDissapears = true;
    });
    this.currentMatchedUser = this.matchedUsers[0];
  }

  resetAnimation(state: string): void {
    this.animationState = state;
    this.changeDetectorRef.detectChanges();
  }

  getNextUser(): void {
    this.matchedUserCounter++;
    this.currentMatchedUser = this.matchedUsers[this.matchedUserCounter];
    this.changeDetectorRef.detectChanges();
  }

  get userSexualPref(): string {
    return this.currentUser.sexualPref;
  }

  matchUser(userEmail: string): void {
    this.userService.addUserMatch(userEmail);
  }

  rejectUser(userEmail: string): void {
    this.userService.addUserReject(userEmail);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
