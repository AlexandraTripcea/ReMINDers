import { NgModule } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatRadioModule} from '@angular/material/radio';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatStepperModule,
    MatRadioModule,
    BrowserAnimationsModule,
  ],
  exports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatStepperModule,
    MatRadioModule,
    BrowserAnimationsModule,
  ]
})
export class MatUiModule { }
