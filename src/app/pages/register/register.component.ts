import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {slider} from '../../../animations';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user/user.service';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';
import {ErrorHandlerService} from '../../services/error-handler/error-handler.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [slider],
})
export class RegisterComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean>;
  registerForm: FormGroup;
  userPassForm: FormGroup;
  submitted = false;
  showNickname = false;
  showHome = false;
  showSexualPref = false;
  showGender = false;
  showBirthdate = false;
  showAnswers = false;
  showWelcome = true;
  showUserPass = false;
  sexualPrefOptions = ['Men', 'Women', 'Both'];
  sexualPrefValue = ['Man', 'Woman', 'Both'];
  question1Options = ['A', 'B', 'C'];
  genderOptions = ['Man', 'Woman', 'Other'];
  errorMessage = '';
  changeDetectorRef: ChangeDetectorRef;
  animationState = 'next';
  private userID = '';
  succes = false;

  constructor(private fb: FormBuilder,
              private auth: AuthService,
              private userService: UserService, private router: Router,
              private errHandler: ErrorHandlerService,
              changeDetectorRef: ChangeDetectorRef) {
    this.changeDetectorRef = changeDetectorRef;
    this.destroy$ = new Subject<boolean>();
    this.registerForm = this.fb.group({
        nickname: ['', [Validators.required, Validators.minLength(3)]],
        home: ['', Validators.required],
        gender: ['', Validators.required],
        birthDate: ['', Validators.required],
        sexualPref: ['', Validators.required],
        question1: ['', Validators.required],
        question2: ['', Validators.required],
        question3: ['', Validators.required],
        question4: ['', Validators.required],
      }
    );
    this.userPassForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('[^@ \\t\\r\\n]+@[^@ \\t\\r\\n]+\\.[^@ \\t\\r\\n]+')]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {
    if (this.auth.getLoginStatus()) {
      this.router.navigate(['/profile']);
    }
  }

  resetAnimation(state: string): void {
    this.animationState = state;
    this.changeDetectorRef.detectChanges();
  }

  get controls(): any {
    return this.registerForm.controls;
  }

  get userPassControls(): any {
    return this.userPassForm.controls;
  }

  async onSubmit(): Promise<void> {
    this.submitted = true;
    if (this.userPassForm.invalid) {
      return;
    } else {
      Object.keys(this.registerForm.controls).forEach((key: string) => {
        if (key.startsWith('q')) {
          this.userID += this.registerForm.get(key).value;
        }
      });
      let currentUser;
      await this.auth.registerNewUser({email: this.userPassControls.email.value, password: this.userPassControls.password.value})
        .then(registerData => currentUser = registerData.user.uid)
        .catch(error => this.errorMessage = this.errHandler.handleError(error.code));
      await this.userService.storeToFirestoreAtDoc(currentUser, '/users', {
        nickname: this.controls.nickname.value,
        home: this.controls.home.value,
        sexualPref: this.controls.sexualPref.value,
        birthDate: ['', Validators.required],
        gender: this.controls.gender.value,
        email: this.userPassControls.email.value,
        ID: this.userID,
        matches: [],
        rejects: [],
        chats: [],
        likes: [],
        profileImg: ''
      }).then(() => {
        this.succes = true;
        setTimeout(() => {
            this.auth.signUserOut();
            this.router.navigate(['login'], {queryParams: {registered: true}});
          }
          , 1000);
      });
    }
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
