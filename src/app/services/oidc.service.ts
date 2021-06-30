import { Injectable } from '@angular/core';
import { UserManager, User, UserManagerSettings, Log } from 'oidc-client';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OidcService {
  private readonly config: UserManagerSettings = {
    authority: "https://rapportcms.unity4.com/oauth",
    client_id: "teleworker-ng-dev",// Client Id not matching
    redirect_uri: "http://localhost:4200/callback.html",
    response_type: "id_token token",
    scope: "openid profile teleworker-api signalr",
    post_logout_redirect_uri: "http://localhost:4200/signout-callback.html",
    silent_redirect_uri: "http://localhost:4200/renew-callback.html",
    automaticSilentRenew: true,
  };

  private oidcUserManager: UserManager;

  private user = new BehaviorSubject<User>(null);
  private error = new BehaviorSubject<Error>(null);

  user$ = this.user.asObservable();
  error$ = this.error.asObservable();
  get accessToken(): string {
    return this.user.value && this.user.value.access_token;
  }

  constructor() {
    Log.logger = console;
    this.oidcUserManager = new UserManager(this.config);
    this.registerDefaultEvents();
    this.initUser();
  }

  private initUser(): void {
    from(this.oidcUserManager.getUser()).subscribe((user) => {
      console.log(user.profile.sid)
      this.loadUser(user);
      if (user === null) {
        this.login();
      } else if (user != null && user.expired === true) {
        this.oidcUserManager.signinSilent();
      }
    });
  }

  private loadUser(user: User): void {
    this.user.next(user);
  }

  login(): void {
    this.oidcUserManager.signinRedirect();
  }

  logout(): void {
    this.oidcUserManager.signoutPopup();
  }

  private registerDefaultEvents(): void {
    this.oidcUserManager.events.addAccessTokenExpiring(() => {
      console.log('accessTokenExpiring');
    });

    this.oidcUserManager.events.addSilentRenewError((error: Error) => {
      console.error('silentRenewError', error);
      this.error.next(error);
    });

    this.oidcUserManager.events.addUserLoaded((user: User) => {
      console.log('userLoaded', user);
      this.loadUser(user);
    });

    this.oidcUserManager.events.addUserUnloaded(() => {
      console.log('userUnloaded');
      this.user.next(null);
    });
  }
}
