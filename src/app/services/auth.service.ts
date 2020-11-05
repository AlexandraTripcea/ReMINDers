import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: AngularFireAuth) {
  }

  signUserIn(credentials: any): Promise<any> {
    return this.auth.signInWithEmailAndPassword(credentials.email, credentials.password);
  }

  getLoginStatus(): any {
    return this.auth.currentUser;
  }

}
