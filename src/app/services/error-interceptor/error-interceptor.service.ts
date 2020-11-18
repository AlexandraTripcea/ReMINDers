import {Injectable} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {UserService} from '../user/user.service';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService implements HttpInterceptor {

  constructor() {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('da')
    return next.handle(request).pipe(catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
        }
        if (err.status === 403 && err.url.search('users/login/')) {
          return throwError('Wrong username or password');
        }
        const error = err.error || err.statusText;
        return throwError(error);
      }
    ));
  }
}
