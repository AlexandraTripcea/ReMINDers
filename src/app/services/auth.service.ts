import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: AngularFireAuth) {
  }


  signUserIn(credentials: any): Promise<any> {
    // const googleAuth = new firebase.default.auth.GoogleAuthProvider();
    // return this.auth.signInWithPopup(googleAuth)
    return this.auth.signInWithEmailAndPassword(credentials.email, credentials.password);
  }

}
