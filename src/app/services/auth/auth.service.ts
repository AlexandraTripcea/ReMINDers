import {Injectable, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  private destroy$: Subject<boolean>;

  constructor(private auth: AngularFireAuth) {
    this.destroy$ = new Subject<boolean>();
    this.auth.onAuthStateChanged(user => {
      if (!!user) {
        localStorage.setItem('loggedInUser', JSON.stringify({uid: user.uid}));
      }
    });
  }

  signUserIn(credentials: any): Promise<any> {
    return this.auth.signInWithEmailAndPassword(credentials.email, credentials.password);
  }

  getLoginStatus(): any {
    return !!localStorage.getItem('loggedInUser');
  }

  getLoginId(): string {
    return JSON.parse(localStorage.getItem('loggedInUser')).uid;
  }

  signUserOut(): Promise<any> {
    localStorage.clear();
    return this.auth.signOut();
  }

  registerNewUser(newUser: any): Promise<any> {
    return this.auth.createUserWithEmailAndPassword(newUser.email, newUser.password);
  }

  resetPassword(email: string): Promise<any> {
    return this.auth.sendPasswordResetEmail(email);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
