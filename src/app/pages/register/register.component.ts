import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {slider} from '../../../animations';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user/user.service';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';

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
  sexualPrefValue = ['Man', 'Woman', 'Both'];
  question1Options = ['A', 'B', 'C'];
  genderOptions = ['Man', 'Woman', 'Other'];
  private userID = '';
  succes = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private userService: UserService, private router: Router) {
    this.destroy$ = new Subject<boolean>();
    this.registerForm = this.fb.group({
        nickname: ['', [Validators.required, Validators.minLength(3)]],
        home: ['', Validators.required],
        gender: ['', Validators.required],
        sexualPref: ['', Validators.required],
        question1: ['', Validators.required],
        question2: ['', Validators.required],
        question3: ['', Validators.required],
        question4: ['', Validators.required],
        email: ['', [Validators.required, Validators.pattern('[^@ \\t\\r\\n]+@[^@ \\t\\r\\n]+\\.[^@ \\t\\r\\n]+')]],
        password: ['', [Validators.required, Validators.minLength(8)]]
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
      this.submitted = true;
      Object.keys(this.registerForm.controls).forEach((key: string) => {
        if (key.startsWith('q')) {
          this.userID += this.registerForm.get(key).value;
        }
      });
      let currentUser;
      await this.authService.registerNewUser({email: this.controls.email.value, password: this.controls.password.value})
        .then(registerData => currentUser = registerData.user.uid);
      await this.userService.storeToFirestoreAtDoc(currentUser, '/users', {
        nickname: this.controls.nickname.value,
        home: this.controls.home.value,
        sexualPref: this.controls.sexualPref.value,
        gender: this.controls.gender.value,
        email: this.controls.email.value,
        ID: this.userID,
      }).then(() => {
        this.succes = true;
        setTimeout(() => {
            this.router.navigate(['login'], {queryParams: {registered: true}});
          }
          , 1500);
      });
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
