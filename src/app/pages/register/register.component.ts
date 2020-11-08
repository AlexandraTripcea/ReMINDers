import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {slider} from '../../../animations';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

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
  showWelcome= true;
  sexualPrefOptions = ['Men', 'Women', 'Both'];
  genderOptions = ['Man', 'Woman', 'Other'];
  constructor(private fb: FormBuilder) {
    this.destroy$ = new Subject<boolean>();
    this.registerForm = this.fb.group({
        nickname: ['', Validators.required],
        home: ['', Validators.required],
        sexualPref: ['', Validators.required],
        gender: ['', Validators.required],
      }
    );
  }

  get controls() {
    return this.registerForm.controls;
  }


  onSubmit(): void {
    this.submitted = true;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
