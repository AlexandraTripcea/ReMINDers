import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../services/user/user.service';
import {BehaviorSubject, from, Observable, Subject} from 'rxjs';
import {fader, sliderNpopper} from '../../../animations';
import {Behavior} from 'popper.js';

@Component({
  selector: 'app-matcher',
  templateUrl: './matcher.component.html',
  styleUrls: ['./matcher.component.scss'],
  animations: [sliderNpopper, fader],
})
export class MatcherComponent implements OnInit, OnDestroy {
  matchedUserCounter = 0;
  private currentUser: any;
  private currentUserId: any;
  matchedUsers = [];
  private destroy$: Subject<boolean>;
  spinnerDissapears = false;
  currentMatchedUser: any;
  private changeDetectorRef: ChangeDetectorRef;
  animationState = 'slider';
  dummyarray = ['Dummy', 'Dummy', 'Dummy', 'Dummy', 'Dummy'];
  matchMessage = '';
  matchMade$: BehaviorSubject<boolean>;

  /*TODO:
  -popup profile sidenav responsive
    -password validators
    -questions
    -homepage
    -register age field, button, and userpass forml
    -handle transitions for register (jumping artifact)
   */
  constructor(private userService: UserService, changeDetectorRef: ChangeDetectorRef) {
    this.changeDetectorRef = changeDetectorRef;
    this.destroy$ = new Subject<boolean>();
    this.matchMade$ = new BehaviorSubject(false);
  }

  async ngOnInit(): Promise<void> {
    await this.userService.getCurrentlyLoggedInUserInfo().then(loggedInUser => {
      this.currentUser = loggedInUser.data;
      this.currentUserId = loggedInUser.uid;
    });
    await this.userService.getMatchedUsers().then(matches => {
      this.matchedUsers = matches;
      this.spinnerDissapears = true;
    });
    this.currentMatchedUser = this.matchedUsers[0];
  }

  resetAnimationAndMessage(state: string): void {
    this.matchMessage = this.currentMatchedUser.data.nickname + ' likes you too!';
    this.animationState = state;
    this.changeDetectorRef.detectChanges();
  }

  getNextUser(): void {
    this.matchMade$.next(false);
    this.matchedUserCounter++;
    this.currentMatchedUser = this.matchedUsers[this.matchedUserCounter];
    this.changeDetectorRef.detectChanges();
  }

  get userSexualPref(): string {
    return this.currentUser.sexualPref;
  }

  async addPossibleMatch(possibleMatch: any): Promise<void> {
    const promisesSet = [];
    if (possibleMatch.data.likes.indexOf(this.currentUserId) !== -1) {
      promisesSet.push(this.userService.addUserLike(possibleMatch.uid));
      promisesSet.push(this.userService.addUserMatch(
        {
          uid: possibleMatch.uid,
          nickname: possibleMatch.data.nickname,
          gender: possibleMatch.data.gender
        }, this.currentUserId));
      promisesSet.push(this.userService.addUserMatch(
        {
          uid: this.currentUserId,
          nickname: this.currentUser.nickname,
          gender: this.currentUser.gender
        }, possibleMatch.uid));
      await Promise.all(promisesSet).then(() => {
        this.matchMade$.next(true);
      }).catch(err => console.log(err));
    } else {
      this.userService.addUserLike(possibleMatch.uid).catch(err => console.log(err));
    }
  }

  rejectUser(newReject: any): void {
    this.userService.addUserReject({uid: newReject.uid, nickname: newReject.data.nickname, gender: newReject.data.gender});
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.matchMade$.complete();
  }
}
