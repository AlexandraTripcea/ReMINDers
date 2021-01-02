import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';
import {Observable, combineLatest, of} from 'rxjs';
import firebase from 'firebase';
import FieldValue = firebase.firestore.FieldValue;

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private router: Router
  ) {
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

  async create(): Promise<boolean> {
    const uid = await this.auth.getLoginId();

    const data = {
      uid,
      createdAt: Date.now(),
      count: 0,
      messages: []
    };
    const docRef = await this.afs.collection('chats').add(data);
    return this.router.navigate(['chats', docRef.id]);
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
}
