import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomepageComponent} from './pages/homepage/homepage.component';
import {LoginComponent} from './pages/login/login.component';
import {RegisterComponent} from './pages/register/register.component';
import {ProfileComponent} from './pages/profile/profile.component';
import {MatcherComponent} from './pages/matcher/matcher.component';
import {UserprofileComponent} from './pages/userprofile/userprofile.component';
import {AuthGuard} from './services/auth/auth.guard';


const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'matcher', component: MatcherComponent, canActivate: [AuthGuard]},
  {path: 'userprofile/:nickname', component: UserprofileComponent, canActivate: [AuthGuard]},

  // otherwise redirect to home
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
