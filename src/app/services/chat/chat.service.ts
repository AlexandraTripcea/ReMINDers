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

  get(chatId): any {
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
    let rightChat = null;
    await this.afs.collection('users')
      .doc(this.auth.getLoginId())
      .get()
      .toPromise<any>().then(data => {
        data.data().chats.forEach((chat) => {
          if (chat.matchedUser === userId) {
            rightChat = chat;
          }
        });
      });
    return rightChat !== null ? rightChat.id : null;
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
      .doc(this.auth.getLoginId())
      .update({chats: FieldValue.arrayUnion({id: docRef.id, matchedUser: userId})});
    return this.router.navigate(['chat', docRef.id]);
  }

  async sendMessage(chatId, content): Promise<void> {
    const uid = await this.auth.getLoginId();

    const data = {
      uid,
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

  joinUsers(chat$: Observable<any>): Observable<any> {
    let chat;
    const joinKeys = {};
    return chat$.pipe(
      switchMap(c => {
        // Unique User IDs
        chat = c;
        const uids = Array.from(new Set(c.messages.map(v => v.uid)));

        // Firestore User Doc Reads
        const userDocs = uids.map(u =>
          this.afs.doc(`users/${u}`).valueChanges()
        );

        return userDocs.length ? combineLatest(userDocs) : of([]);
      }),
      map(arr => {
        arr.forEach(v => (joinKeys[(v as any).uid] = v));
        chat.messages = chat.messages.map(v => {
          return {...v, user: joinKeys[v.uid]};
        });

        return chat;
      })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
