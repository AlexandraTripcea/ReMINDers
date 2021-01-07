import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean>;

  constructor() {
    this.destroy$ = new Subject<boolean>();

  }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
