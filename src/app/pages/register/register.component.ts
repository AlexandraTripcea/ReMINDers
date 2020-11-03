import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {fader} from '../../../animations';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [fader],
})
export class RegisterComponent implements OnInit, OnDestroy {
  test = false;
  private destroy$: Subject<boolean>;
  private registerForm: FormGroup;

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

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
