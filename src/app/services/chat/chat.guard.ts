import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {UserService} from '../user/user.service';


@Injectable({providedIn: 'root'})
export class ChatGuard implements CanActivate {

  constructor(
    private router: Router,
    private userService: UserService
  ) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    let currentUser;
    await this.userService.getCurrentlyLoggedInUserInfo().then(loggedInUser => currentUser = loggedInUser);
    let chat;
    await this.userService.getFromFirestore('chats', route.url[1].path).then(foundChat => chat = foundChat.data());
    if (currentUser.uid === chat.uid1 || currentUser.uid === chat.uid2) {
      return true;
    }
    this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
    return false;
  }
}
