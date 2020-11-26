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
  public nickname;
  public subs;

  constructor(private route: ActivatedRoute, private userService: UserService) {
    this.destroy$ = new Subject<boolean>();

  }

  async ngOnInit(): Promise<void> {
    this.nickname = this.route.snapshot.params.nickname;
    this.user = await this.userService.getUserWithNickname(this.nickname);
    this.user.subscribe(u => {
      this.userData = u[0];
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
