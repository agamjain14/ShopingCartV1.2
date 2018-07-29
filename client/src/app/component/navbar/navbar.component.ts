import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../shared/user';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { AdminAuthGuard } from '../../guards/admin.auth.guard';
import { Subscription } from 'rxjs/Subscription';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {


  user$: Observable<any>;
  username: Observable<any>;
  email;

  constructor(private authService: AuthService, private router: Router, private adminGuard: AdminAuthGuard) {

   }

   getUser () {
    // this.authService.getProfile().subscribe(user => this.user$ =  user.user);
   }
   ngOnInit () {
    // this.getUser();
    /*this.user$ = this.authService.getProfile().map(user => {
       return user.user.username;
      });*/
      this.authService.getProfile().subscribe(profile => {
        console.log('profile.user from profile ' + profile.user.username);
        this.username = profile.user.username;
        this.email = profile.user.email;
      });

   }


  onLogoutClick() {
    // console.log('this.user' + this.user$.email);
    this.authService.logout();
    this.router.navigate(['/']);
  }

}
