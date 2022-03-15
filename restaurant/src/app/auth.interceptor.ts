import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {TokenStorageService} from "./services/token-storage.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private token : TokenStorageService) {}

  intercept(req: HttpRequest<any>,
            next: HttpHandler): Observable<HttpEvent<any>> {

    const idToken = this.token.getToken();

    if (idToken) {
      const cloned = req.clone({
        headers: req.headers.set("x-access-token", idToken)
      });

      return next.handle(cloned);
    }
    else {
      return next.handle(req);
    }
  }
}
