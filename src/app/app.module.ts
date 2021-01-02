import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './pages/login/login.component';
import {RegisterComponent} from './pages/register/register.component';
import {HomepageComponent} from './pages/homepage/homepage.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularFireModule} from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {environment} from '../environments/environment';
import {NavbarComponent} from './components/navbar/navbar.component';
import {MatUiModule} from './mat-ui.module';
import {ProfileComponent} from './pages/profile/profile.component';
import {MatcherComponent} from './pages/matcher/matcher.component';
import {SpinnerComponent} from './components/spinner/spinner.component';
import {AuthGuard} from './services/auth/auth.guard';
import { UserprofileComponent } from './pages/userprofile/userprofile.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { PopupComponent } from './components/popup/popup.component';
import { ChatComponent } from './pages/chat/chat.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomepageComponent,
    NavbarComponent,
    ProfileComponent,
    MatcherComponent,
    SpinnerComponent,
    UserprofileComponent,
    PopupComponent,
    ChatComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatUiModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule.enablePersistence(),
    AppRoutingModule,
   ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
}
