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

  addUserLike(newUserMatch: string): Promise<void> {
    return this.firestore.collection('users')
      .doc(this.auth.getLoginId())
      .update({likes: FieldValue.arrayUnion(newUserMatch)});
  }

  addUserMatch(newUserMatch: any, userWithNewMatch: string): Promise<void> {
    return this.firestore.collection('users')
      .doc(userWithNewMatch)
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

  async getUserActualMatches(): Promise<any> {
    let actualUser;
    await this.getCurrentlyLoggedInUserInfo().then(user => actualUser = user).catch(err => console.log(err));
    return actualUser.matches;
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
      .toPromise<any>().then(data => {
        alreadyMatchedUsers = data.data().likes;
      });
    if (currentUser.sexualPref !== 'Both') {
      await this.firestore.collection('users').ref
        .where('gender', '==', `${currentUser.sexualPref}`)
        .limit(50).get().then((data: any) => data
          .forEach((newUser) => {
            if (newUser.data().email !== currentUser.email
              && alreadyMatchedUsers.findIndex(user => user === newUser.id) === -1
              && rejectedUsers.findIndex(user => user === newUser.id) === -1) {
              rightGenderUsers.push({data: newUser.data(), uid: newUser.id});
            }
          }));
    } else {
      await this.firestore.collection('users').ref
        .limit(50).get().then((data: any) => data
          .forEach((newUser) => {
            if (newUser.data().email !== currentUser.email
              && alreadyMatchedUsers.findIndex(user => user.uid === newUser.id) === -1
              && rejectedUsers.findIndex(user => user.uid === newUser.id) === -1) {
              rightGenderUsers.push({data: newUser.data(), uid: newUser.id});
            }
          }));
    }
    return this.matchUsers(rightGenderUsers, currentUser.ID);
  }

  async getCurrentlyLoggedInUserInfo(): Promise<any> {
    let currentUser: any;
    await this.getUserFromFirestore(this.auth.getLoginId())
      .toPromise()
      .then(user => {
        currentUser = user.data();
      });
    return currentUser;
  }

  async savePhoto(uploadData: any): Promise<string> {
    const storageRef = firebase.storage().ref();
    const loggedInId = this.auth.getLoginId();
    let profileImgUrl = '';
    const imageRef = storageRef.child('profileimages/' + loggedInId + '/profileImage.jpg');
    await imageRef.put(uploadData).then(async (response) => await response.ref
      .getDownloadURL().then(url => {
        profileImgUrl = url;
      }));
    await this.firestore.collection('users').doc(loggedInId).update({profileImg: profileImgUrl});
    return profileImgUrl;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
