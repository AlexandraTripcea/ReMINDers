import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {ErrorHandlerService} from '../../services/error-handler/error-handler.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  submitted = false;
  email = '';
  errorMessage = '';

  constructor(private auth: AuthService, private errHandler: ErrorHandlerService, private router: Router) {
  }

  ngOnInit(): void {
  }

  resetPasword(): void {
    if (this.email !== '') {
      this.auth.resetPassword(this.email)
        .then(() => this.router.navigate(['/login']))
        .catch(err => this.errorMessage = this.errHandler.handleError(err.code));
    }
  }

}
