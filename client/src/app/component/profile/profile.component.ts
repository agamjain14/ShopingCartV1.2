import { Component, OnInit, Input } from '@angular/core';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {


  username;
  email;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      console.log('profile.user from profile ' + profile.user.username);
      this.username = profile.user.username;
      this.email = profile.user.email;
    });
  }

}
