import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {UserService} from '../../services/user/user.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {ChatService} from '../../services/chat/chat.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean>;
  public currentUser: any;
  profileForm: FormGroup;
  editable = true;
  matchedUsers = [];

  constructor(private userService: UserService,
              private fb: FormBuilder,
              private router: Router,
              private authService: AuthService,
              private cs: ChatService) {
    this.destroy$ = new Subject<boolean>();
  }

  signUserOut(): void {
    this.authService.signUserOut();
  }

  async ngOnInit(): Promise<void> {
    this.profileForm = this.fb.group({
      nickname: [''],
      gender: [''],
      home: [''],
      sexualPref: [''],
    });
    this.currentUser = await this.userService.getCurrentlyLoggedInUserInfo();

    await this.userService.getUserActualMatches().then(matches => {
      this.matchedUsers = matches;
    });
    this.updateForm();
  }

  async initializeChat(userId: string): Promise<boolean> {
    let chatId;
    await this.cs.checkChatExistence(userId).then(rightChat => chatId = rightChat);
    if (chatId !== null) {
      return this.router.navigate(['chat', chatId]);
    } else {
      return await this.cs.create(userId);
    }
  }

  updateForm(): void {
    this.profileForm = this.fb.group({
      nickname: this.currentUser.nickname,
      gender: this.currentUser.gender,
      home: this.currentUser.home,
      sexualPref: this.currentUser.sexualPref,
    });
  }

  disableForm(): void {
    this.profileForm.disable();
  }

  onSubmit(): void {
    this.profileForm = this.fb.group({
      nickname: this.profileForm.value.nickname,
      gender: this.profileForm.value.gender,
      home: this.profileForm.value.home,
      sexualPref: this.profileForm.value.sexualPref,
    });
  }

  async saveProfileData(): Promise<void> {
    // console.log('FORM GROUP DATA');
    // console.log(this.profileForm.value.nickname);
    // console.log(this.profileForm.value.home);
    // console.log(this.profileForm.value.sexualPref);
    // console.log(this.profileForm.value.gender);
    // console.log('----------');
    if (this.editable) {
      await this.userService.updateProfileData(this.authService.getLoginId(), '/users', {
        nickname: this.profileForm.value.nickname,
        home: this.profileForm.value.home,
        sexualPref: this.profileForm.value.sexualPref,
        gender: this.profileForm.value.gender,
      });
      this.editable = false;
      this.disableForm();
    } else {
      this.editable = true;
    }
  }

  getColorEdit(): string {
    if (this.editable) {
      return 'primary';
    } else {
      return 'false';
    }
  }

  isDisabled(): string {
    if (this.editable) {
      return 'false';
    } else {
      return 'true';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
