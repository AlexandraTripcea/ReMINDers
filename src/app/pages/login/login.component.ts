import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {AuthService} from '../../services/auth.service';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean>;
  loginForm: FormGroup;
  private succes = false;
  private error = false;
  submitted = false;

  constructor(private auth: AuthService, private fb: FormBuilder) {
    this.destroy$ = new Subject<boolean>();
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('[^@ \\t\\r\\n]+@[^@ \\t\\r\\n]+\\.[^@ \\t\\r\\n]+')]],
      password: ['', [Validators.required]],
      trappy: ['']
    });
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
    }).then(data => this.succes = true).catch(data => this.error = true);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

}
