import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../../services/user/user.service';


@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss']
})
export class UserprofileComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean>;
  public user: any;
  public userData: any;
  public uid;

  constructor(private route: ActivatedRoute, private userService: UserService) {
    this.destroy$ = new Subject<boolean>();
  }

  async ngOnInit(): Promise<void> {
    this.uid = this.route.snapshot.params.uid;
    this.user = await this.userService.getUserFromFirestore(this.uid);
    this.user.subscribe(u => {
      this.userData = u[0];
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
