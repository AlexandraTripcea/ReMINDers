import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {AuthService} from '../../services/auth/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ErrorHandlerService} from '../../services/error-handler/error-handler.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean>;
  loginForm: FormGroup;
  submitted = false;
  errorMessage = '';
  registeredSuccesfully = false;

  constructor(private auth: AuthService,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private errHandler: ErrorHandlerService) {
    this.destroy$ = new Subject<boolean>();
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('[^@ \\t\\r\\n]+@[^@ \\t\\r\\n]+\\.[^@ \\t\\r\\n]+')]],
      password: ['', [Validators.required]],
      trappy: ['']
    });
    if (this.route.snapshot.queryParams.registered) {
      this.registeredSuccesfully = true;
    }
    if (this.auth.getLoginStatus()) {
      this.router.navigate(['/profile']);
    }
  }

  get controls() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid || this.controls.trappy.value !== '') {
      return;
    }
    this.auth.signUserIn({
      email: this.controls.email.value,
      password: this.controls.password.value
    }).then(() => this.router.navigate(['profile'])).catch(err => this.errorMessage = this.errHandler.handleError(err.code));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
