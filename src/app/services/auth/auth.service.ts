import {Injectable, OnDestroy} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {UserService} from '../user/user.service';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  private destroy$: Subject<boolean>;
  private loggedIn = false;

  constructor(private auth: AngularFireAuth, private userService: UserService) {
    this.destroy$ = new Subject<boolean>();
    this.auth.onAuthStateChanged(user => this.userService
      .getUserFromFirestore(user.uid)
      .subscribe((data) => {
        localStorage.setItem('loggedInUser', JSON.stringify(
          {ID: data.ID, gender: data.gender, home: data.home, nickname: data.nickname, sexualPref: data.sexualPref}));
        this.loggedIn = true;
      }));
  }

  signUserIn(credentials: any): Promise<any> {
    return this.auth.signInWithEmailAndPassword(credentials.email, credentials.password);
  }

  getLoginStatus(): any {
    return this.loggedIn;
  }

  signUserOut(): Promise<any> {
    localStorage.clear();
    return this.auth.signOut();
  }

  registerNewUser(newUser: any): Promise<any> {
    return this.auth.createUserWithEmailAndPassword(newUser.email, newUser.password);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
