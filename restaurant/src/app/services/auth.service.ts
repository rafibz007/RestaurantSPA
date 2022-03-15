import {HostListener, Injectable, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiConnectionService} from "./api-connection.service";
import {User} from "../user";
import * as moment from "moment";
import {Role} from "../role";
import {TokenStorageService} from "./token-storage.service";
import {BehaviorSubject, Subject} from "rxjs";
import {Moment} from "moment";
import {UserService} from "../user.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy, OnInit{

  sessionStatus$ = new Subject<boolean>()
  loggedUser$ = new BehaviorSubject<User|null>(null)

  getSessionStatus$(){
    return this.sessionStatus$.asObservable()
  }

  getLoggedUser$(){
    return this.loggedUser$.asObservable()
  }

  constructor(private http : HttpClient, private api : ApiConnectionService, private token : TokenStorageService, private router : Router) {
    //todo w zaleznosci od ustawien persistencji albo usune token, albo wczytam info z serwera o uzytkowniku i zaloguje go
    this.token.removeToken()
  }

  ngOnInit(): void {
  }

  login(username:string, email:string, password:string){
    return this.http.post<Response>(this.api.BASE_URL + "/login", {username:username, email:email, password:password} )
  }

  setSession(authResult : Response) : boolean{
    if (!authResult.login)
      return false

    this.token.setToken(authResult.idToken, authResult.expiresIn)

    const user = authResult.user
    const roles = []
    for (let role of user.rolesIDs){
      if (role === "0") roles.push(Role.ADMIN)
      else if (role === "1") roles.push(Role.MANAGER)
      else if (role === "2") roles.push(Role.CLIENT)
    }

    let orders = new Map()
    for (let position of user.orderHistory)
      orders.set(position.dishId, {amount:position.amount, price:position.price, date:new Date(position.date)})

    let currentUser = {
      _id:user._id,
      username:user.username,
      email:user.email,
      rolesIDs:roles,
      isBanned:user.isBanned,
      orderHistory:orders,
    }

    this.loggedUser$.next(currentUser)
    this.sessionStatus$.next(true)

    return true
  }

  logout() {

    this.token.removeToken()
    this.http.post(this.api.BASE_URL + "/logout", {}).subscribe()
    this.router.navigateByUrl('/')

    this.loggedUser$.next(null)
    this.sessionStatus$.next(true)

  }

  isLoggedIn() {
    // console.log(moment())
    // console.log(this.token.getExpirationMoment())
    // console.log(moment().isBefore(this.token.getExpirationMoment()))
    return moment().isBefore(this.token.getExpirationMoment())
  }


  ngOnDestroy(): void {
    this.logout()
  }
}

interface Response{
  login:boolean, message:string, idToken:string, expiresIn:number ,user:{
    _id:string,
    username:string,
    email:string,
    rolesIDs:Array<string>,
    isBanned:boolean,
    orderHistory:Array<{dishId:string, amount:number, price:number, date:string}>
  }
}
