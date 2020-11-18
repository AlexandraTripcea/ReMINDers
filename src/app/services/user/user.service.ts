import {Injectable, OnDestroy} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {
  private destroy$: Subject<boolean>;

  constructor(private firestore: AngularFirestore) {
    this.destroy$ = new Subject<boolean>();

  }

  getFromFirestore(path: string): Observable<any> {
    return this.firestore.collection(path).valueChanges();
  }

  getUserFromFirestore(docId: any): Observable<any> {
    return this.firestore.collection('users').doc(docId).valueChanges();
  }


  storeToFirestoreAtDoc(docId: any, path: string, docData: any): Promise<any> {
    return this.firestore.collection(path).doc(docId).set(docData);
  }

  private matchUsers(allUsers: any, idToMatch: string): any {
    let hammingDistanceCount = 0;
    const matchedUsers = [];
    allUsers.forEach((user) => {
      for (let answerIndex = 0; answerIndex < user.ID.length; ++answerIndex) {
        if (user.ID[answerIndex] === idToMatch[answerIndex]) {
          hammingDistanceCount++;
        }
      }
      if (hammingDistanceCount / user.ID.length > 0.75) {
        matchedUsers.push(user);
        hammingDistanceCount = 0;
      }
    });
    return matchedUsers;
  }

  async getMatchedUsers(): Promise<any> {
    const rightGenderUsers = [];
    const currentUser = JSON.parse(localStorage.getItem('loggedInUser'));
    await this.firestore.collection('users').ref
      .where('gender', '==', `${currentUser.sexualPref}`)
      .limit(100).get().then(data => data
        .forEach((user) => rightGenderUsers.push(user.data())));
    return this.matchUsers(rightGenderUsers, currentUser.ID);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
