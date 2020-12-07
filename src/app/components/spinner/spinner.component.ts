import {Component, OnInit} from '@angular/core';
import {host} from '@angular-devkit/build-angular/src/test-utils';
import {fader} from '../../../animations';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  animations: [fader],
  host: {'[@fader]': ''}
})

export class SpinnerComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
