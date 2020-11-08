import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {slider} from '../../../animations';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [slider],
})
export class RegisterComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean>;
  registerForm: FormGroup;
  submitted = false;
  showNickname = false;
  showHome = false;
  showSexualPref = false;
  showGender = false;
  showAnswers = false;
  showWelcome = true;
  showUserPass = false;
  sexualPrefOptions = ['Men', 'Women', 'Both'];
  sexualPrefValues = ['M', 'W', 'B'];
  question1Options = ['A', 'B', 'C'];
  genderOptions = ['Man', 'Woman', 'Other'];
  genderValues = ['M', 'W', 'O'];
  private userID = '';
  private success = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private userService: UserService) {
    this.destroy$ = new Subject<boolean>();
    this.registerForm = this.fb.group({
        nickname: ['', Validators.required],
        home: ['', Validators.required],
        gender: ['', Validators.required],
        sexualPref: ['', Validators.required],
        question1: ['', Validators.required],
        question2: ['', Validators.required],
        question3: ['', Validators.required],
        question4: ['', Validators.required],
        email: ['', Validators.required],
        password: ['', Validators.required]
      }
    );
  }

  get controls() {
    return this.registerForm.controls;
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) {
      return;
    } else {
      let loginUser = false;
      let storeUser = false;
      this.submitted = true;
      Object.keys(this.registerForm.controls).forEach((key: string) => {
        if (key.startsWith('q') || key.startsWith('s') || key.startsWith('g')) {
          this.userID += this.registerForm.get(key).value[0];
        }
      });
      await this.authService.registerNewUser({email: this.controls.email.value, password: this.controls.password.value})
        .then(data => loginUser = true).catch(err => console.log('Registration failed'));
      if (loginUser) {
        await this.authService.signUserIn({email: this.controls.email.value, password: this.controls.password.value})
          .then(data => storeUser = true)
          .catch(err => console.log('Login failed'));
        if (storeUser) {
          let currentUser;
          await this.authService.getLoginStatus().then(user => currentUser = user.uid);
          await this.userService.storeToFirestoreAtDoc(currentUser, '/users', {
            nickname: this.controls.nickname.value,
            home: this.controls.home.value,
            sexualPref: this.controls.sexualPref.value,
            gender: this.controls.gender.value,
            ID: this.userID,
          }).then(() => this.success = true).catch(() => console.log('Store to Firebase failed'));
        }
      }
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
