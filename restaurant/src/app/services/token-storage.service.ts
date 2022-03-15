import { Injectable } from '@angular/core';
import * as moment from "moment";
import {CookieService} from "ngx-cookie";
import {HostListener} from "@angular/core";


@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  TOKEN_ID = "x-access-token"
  EXPIRES_AT = "expiresAt"
  tokenSet = false

  constructor(private cookie : CookieService) {
  }

  // setToken(token : string, expiresIn : string){
  //   localStorage.setItem(this.TOKEN_ID, token)
  //   localStorage.setItem(this.EXPIRES_AT, expiresIn)
  //   this.cookie.put()
  // }

  setToken(token : string, expiresIn:number){
    const expiresAt = moment().add(expiresIn, 'second')

    sessionStorage.setItem(this.TOKEN_ID, token)
    sessionStorage.setItem(this.EXPIRES_AT, JSON.stringify(expiresAt.valueOf()))

    // this.cookie.put(this.TOKEN_ID, token)

    this.tokenSet = true
  }

  removeToken(){
    sessionStorage.removeItem(this.TOKEN_ID)
    sessionStorage.removeItem(this.EXPIRES_AT)
    this.tokenSet = false
  }

  getToken(){
    return sessionStorage.getItem(this.TOKEN_ID)
  }

  getExpirationMoment(){
    if (sessionStorage.getItem(this.EXPIRES_AT) === null)
      return moment()
    // @ts-ignore
    const expiration : string = sessionStorage.getItem(this.EXPIRES_AT)
    const expiresAt = JSON.parse(expiration)
    return moment(expiresAt)
  }



}
