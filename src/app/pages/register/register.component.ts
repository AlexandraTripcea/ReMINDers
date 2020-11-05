import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {fader} from '../../../animations';
import {Form, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [fader],
})
export class RegisterComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean>;
  registerForm: FormGroup;
  submitted = false;
  showNickname = true;
  showHome = false;
  showSexualPref = false;
  showGender = false;
  showAnswers = false;

  constructor(private fb: FormBuilder) {
    this.destroy$ = new Subject<boolean>();
    this.registerForm = this.fb.group({
        nickname: ['', Validators.required],
        home: ['', Validators.required],
        sexualPref: [this.getControlArray(3), Validators.required],
        gender: [this.getControlArray(3), Validators.required],
      }
    );
  }

  get controls() {
    return this.registerForm.controls;
  }

  private getControlArray(nrOfControls: number): FormArray {
    const controlArray = [];
    for (let i = 0; i < nrOfControls; ++i) {
      controlArray.push(this.fb.control(0));
    }
    return this.fb.array(controlArray);
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
