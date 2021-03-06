import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subject} from 'rxjs';
import {UserService} from '../../services/user/user.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {ChatService} from '../../services/chat/chat.service';
import {MatChipInputEvent} from '@angular/material/chips';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean>;
  public currentUser = null;
  modifiedForm = false;
  profileForm: FormGroup;
  matchedUsers = [];
  profileImgUrl = '';
  spinnerDissapears = false;
  birthDate: Date;
  age: any;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  hobbies = [];

  constructor(private userService: UserService,
              private fb: FormBuilder,
              private router: Router,
              private authService: AuthService,
              private cs: ChatService) {
    this.destroy$ = new Subject<boolean>();
  }

  async ngOnInit(): Promise<void> {
    this.profileForm = this.fb.group({
      nickname: [''],
      gender: [''],
      home: [''],
      sexualPref: [''],
      bio: [''],
    });
    await this.userService.getCurrentlyLoggedInUserInfo().then(loggedInUser => this.currentUser = loggedInUser.data);

    await this.userService.getUserActualMatches().then(matches => {
      this.matchedUsers = matches;
      this.profileImgUrl = this.currentUser.profileImg;
      this.spinnerDissapears = true;
    });

    this.birthDate = await this.currentUser.birthDate.toDate();
    const timeDiff = Date.now() - this.birthDate.getTime();
    this.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
    this.hobbies = await this.currentUser.hobbies;

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
      bio: this.currentUser.bio,
    });
  }

  onSubmit(): void {
    this.profileForm = this.fb.group({
      nickname: this.profileForm.value.nickname,
      gender: this.profileForm.value.gender,
      home: this.profileForm.value.home,
      sexualPref: this.profileForm.value.sexualPref,
      bio: this.profileForm.value.bio,
    });
  }

  async saveProfileData(): Promise<void> {
    // console.log('FORM GROUP DATA');
    // console.log(this.profileForm.value.nickname);
    // console.log(this.profileForm.value.home);
    // console.log(this.profileForm.value.sexualPref);
    // console.log(this.profileForm.value.gender);
    // console.log('----------');
    this.modifiedForm = false;
    await this.userService.updateProfileData(this.authService.getLoginId(), '/users', {
      nickname: this.profileForm.value.nickname,
      home: this.profileForm.value.home,
      sexualPref: this.profileForm.value.sexualPref,
      gender: this.profileForm.value.gender,
      bio: this.profileForm.value.bio,
      hobbies: this.hobbies,
    }).then(() => this.modifiedForm = true);
  }

  onFileChanged(event): void {
    let selectedFile: any;
    selectedFile = event.target.files[0];
    if (!!selectedFile && selectedFile.type.split('/')[0] === 'image') {
      this.userService.savePhoto(selectedFile).then(newProfileImgUrl => {
        this.profileImgUrl = newProfileImgUrl;
      });
    }
  }

  addChip(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add our hobby
    if ((value || '').trim()) {
      this.hobbies.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(hobby: string): void {
    const index = this.hobbies.indexOf(hobby);

    if (index >= 0) {
      this.hobbies.splice(index, 1);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
