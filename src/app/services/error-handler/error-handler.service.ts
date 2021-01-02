import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  handleError(code: string): string {
    if (code === 'auth/user-not-found') {
      return 'No user with this email was found';
    }
    if (code === 'auth/wrong-password') {
      return 'You have provided the wrong password';
    }
    if (code === 'auth/email-already-in-use') {
      return 'This email is already in use';
    }
  }
}
