import {Injectable, OnDestroy} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable, Subject} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import firebase from 'firebase/app';
import FieldValue = firebase.firestore.FieldValue;

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {
  private destroy$: Subject<boolean>;

  constructor(private firestore: AngularFirestore, private auth: AuthService) {
    this.destroy$ = new Subject<boolean>();
  }

  addUserMatch(newUserMatch: any): Promise<void> {
    return this.firestore.collection('users')
      .doc(this.auth.getLoginId())
      .update({matches: FieldValue.arrayUnion(newUserMatch)});
  }

  addUserReject(newUserReject): Promise<void> {
    return this.firestore.collection('users')
      .doc(this.auth.getLoginId())
      .update({rejects: FieldValue.arrayUnion(newUserReject)});
  }

  getFromFirestore(path: string): Observable<any> {
    return this.firestore.collection(path).valueChanges();
  }

  getUserFromFirestore(docId: any): Observable<any> {
    return this.firestore.collection('users').doc(docId).get();
  }

  storeToFirestoreAtDoc(docId: any, path: string, docData: any): Promise<any> {
    return this.firestore.collection(path).doc(docId).set(docData);
  }

  updateProfileData(docId: any, path: string, docData: any): Promise<any> {
    return this.firestore.collection(path)
      .doc(docId)
      .update({nickname: docData.nickname, home: docData.home, sexualPref: docData.sexualPref, gender: docData.gender})
      .catch(error => console.log(error));
  }

  private matchUsers(allUsers: any, idToMatch: string): any {
    let hammingDistanceCount = 0;
    const matchedUsers = [];
    allUsers.forEach((user) => {
      for (let answerIndex = 0; answerIndex < user.data.ID.length; ++answerIndex) {
        if (user.data.ID[answerIndex] === idToMatch[answerIndex]) {
          hammingDistanceCount++;
        }
      }
      if (hammingDistanceCount / user.data.ID.length >= 0.5) {
        matchedUsers.push(user);
        hammingDistanceCount = 0;
      }
    });
    return matchedUsers;
  }

  async getMatchedUsers(): Promise<any> {
    const rightGenderUsers = [];
    const currentUser = await this.getCurrentlyLoggedInUserInfo();
    let rejectedUsers = [];
    let alreadyMatchedUsers = [];
    await this.firestore.collection('users')
      .doc(this.auth.getLoginId())
      .get()
      .toPromise<any>().then(data => rejectedUsers = data.data().rejects);
    await this.firestore.collection('users')
      .doc(this.auth.getLoginId())
      .get()
      .toPromise<any>().then(data => alreadyMatchedUsers = data.data().matches);
    if (currentUser.sexualPref !== 'Both') {
      await this.firestore.collection('users').ref
        .where('gender', '==', `${currentUser.sexualPref}`)
        .limit(50).get().then((data: any) => data
          .forEach((newUser) => {
            if (newUser.data().email !== currentUser.email
              && alreadyMatchedUsers.findIndex(user => user.id === newUser.uid) === -1
              && rejectedUsers.findIndex(user => user.id === newUser.uid) === -1) {
              rightGenderUsers.push({data: newUser.data(), uid: newUser.id});
            }
          }));
    } else {
      await this.firestore.collection('users').ref
        .limit(100).get().then((data: any) => data
          .forEach((newUser) => {
            if (newUser.data().email !== currentUser.email
              && alreadyMatchedUsers.findIndex(user => user.id === newUser.uid) === -1
              && rejectedUsers.findIndex(user => user.id === newUser.uid) === -1) {
              rightGenderUsers.push({data: newUser.data(), uid: newUser.id});
            }
          }));
    }
    return this.matchUsers(rightGenderUsers, currentUser.ID);
  }

  async getCurrentlyLoggedInUserInfo(): Promise<any> {
    let currentUser: any;
    await this.getUserFromFirestore(JSON.parse(localStorage.getItem('loggedInUser')).uid)
      .toPromise()
      .then(user => {
        currentUser = user.data();
      });
    return currentUser;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
