import {Component, OnInit} from '@angular/core';
import {ChatService} from '../../services/chat/chat.service';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  chat$: Observable<any>;
  newMsg: string;
  loggedInUser = '';

  constructor(
    public cs: ChatService,
    private route: ActivatedRoute,
    public auth: AuthService
  ) {
  }

  ngOnInit(): void {
    this.loggedInUser = this.auth.getLoginId();
    const chatId = this.route.snapshot.paramMap.get('id');
    this.chat$ = this.cs.get(chatId);
  }

  submit(chatId): void {
    console.log(this.newMsg)
    this.cs.sendMessage(chatId, this.newMsg);
    this.newMsg = '';
  }

  trackByCreated(i, msg): number {
    return msg.createdAt;
  }
}
