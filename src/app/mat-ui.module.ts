import { NgModule } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatRadioModule} from '@angular/material/radio';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatToolbarModule} from '@angular/material/toolbar';


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
    MatCardModule,
    MatExpansionModule,
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    MatSidenavModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatToolbarModule,
  ],
  exports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatStepperModule,
    MatRadioModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatCardModule,
    MatTabsModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatSidenavModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatToolbarModule,
  ]
})
export class MatUiModule { }
