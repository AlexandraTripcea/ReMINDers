import {Injectable, OnDestroy} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';
import {Observable, combineLatest, of, Subject} from 'rxjs';
import firebase from 'firebase';
import FieldValue = firebase.firestore.FieldValue;
import {UserService} from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService implements OnDestroy {
  private destroy$: Subject<boolean>;

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    this.destroy$ = new Subject<boolean>();
  }

  get(chatId): Observable<any> {
    return this.afs
      .collection<any>('chats')
      .doc(chatId)
      .snapshotChanges()
      .pipe(
        map(doc => {
          return {id: doc.payload.id, ...doc.payload.data()};
        })
      );
  }

  async checkChatExistence(userId: string): Promise<string> {
    let rightChat: string = null;
    await this.afs.collection('users')
      .doc(this.auth.getLoginId())
      .get()
      .toPromise<any>().then(data => {
        data.data().chats.forEach((chat) => {
          if (chat.matchedUsers.indexOf(userId) !== -1) {
            rightChat = chat.id;
          }
        });
      });
    return rightChat !== null ? rightChat : null;
  }

  async create(userId: string): Promise<boolean> {
    const uid = await this.auth.getLoginId();

    const data = {
      uid1: uid,
      uid2: userId,
      createdAt: Date.now(),
      messages: []
    };
    const docRef = await this.afs.collection('chats').add(data);
    this.afs.collection('users')
      .doc(uid)
      .update({chats: FieldValue.arrayUnion({id: docRef.id, matchedUsers: [uid, userId]})});
    this.afs.collection('users')
      .doc(userId)
      .update({chats: FieldValue.arrayUnion({id: docRef.id, matchedUsers: [uid, userId]})});
    return this.router.navigate(['chat', docRef.id]);
  }

  async sendMessage(chatId: string, content: string): Promise<void> {
    const uid = await this.auth.getLoginId();
    let nickname = '';
    await this.userService.getCurrentlyLoggedInUserInfo().then(loggedInUser => nickname = loggedInUser.nickname);
    const data = {
      nickname,
      content,
      createdAt: Date.now()
    };

    if (uid) {
      const ref = this.afs.collection('chats').doc(chatId);
      return ref.update({
        messages: FieldValue.arrayUnion(data)
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
