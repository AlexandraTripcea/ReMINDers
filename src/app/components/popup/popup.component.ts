import {Component, Input, OnInit} from '@angular/core';
import $ from 'jquery';

declare var $: $;

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {

  @Input()
  popupMessage = '';
  @Input()
  buttonMessage = 'Ok';

  constructor() {
  }

  ngOnInit(): void {
     $(document).ready(() =>
       $('#infoPopup').modal('show'));
  }

}
