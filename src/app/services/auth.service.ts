import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserAuth } from '../../assets/user-auth';
import { OidcService } from './oidc.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userAuthSub = new BehaviorSubject<UserAuth>(null);
  private tempAuthSub = new BehaviorSubject(null);
  get user() {
    return this.tempAuthSub.value;
  }

  constructor(http: HttpClient, private oidc: OidcService) {
  /*   http
      //.get<UserAuth>('https://localhost:5002/api/auth')
      .get<any>('https://rapportcms.unity4.com/oauth')
      .subscribe((userAuth) => {
        console.log(userAuth)
        this.userAuthSub.next(userAuth)
      }); */
  }
  getLoggedinUser(){
    this.oidc.user$.subscribe(r =>{
      console.log(r);
      this.tempAuthSub.next({userID:r.profile.sub, sid: r.profile.sid})
    })
  }
}
