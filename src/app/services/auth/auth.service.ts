import {Injectable, OnDestroy} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {first, switchMap} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  private destroy$: Subject<boolean>;
  private loggedInId = '';
  constructor(private auth: AngularFireAuth) {
    this.destroy$ = new Subject<boolean>();
    this.auth.onAuthStateChanged(user => {
      if (!!user) {
        localStorage.setItem('loggedInUser', JSON.stringify({uid: user.uid}));
        this.loggedInId = user.uid;
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
    this.loggedInId = '';
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
