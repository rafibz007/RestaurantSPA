import { Injectable } from '@angular/core';
import {Comment} from "../comment";
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ApiConnectionService} from "./api-connection.service";
import {AuthService} from "./auth.service";
import {UserService} from "../user.service";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  loading$ = new BehaviorSubject<boolean>(true)

  observersCommentsForDish : Map<string, BehaviorSubject<Comment[]>> = new Map<string, BehaviorSubject<Comment[]>>()
  commentsForDish : Map<string, Comment[]> = new Map<string, Comment[]>()

  //todo after logout requests for every visited product details comments is made and (which is good) 401 is received
  constructor(private http : HttpClient, private api : ApiConnectionService, private auth : AuthService, private user:UserService) {
      this.auth.getSessionStatus$().subscribe(
        _ => {
          this.observersCommentsForDish.clear()
          this.commentsForDish.clear()
        }
      )
  }

  getLoading$(){
    return this.loading$
  }

  getCommentsForDish( id : string ) : Observable<Comment[]>{
    if (this.observersCommentsForDish.has(id))
      { // @ts-ignore
        return this.observersCommentsForDish.get(id).asObservable()
      }

    this.commentsForDish.set(id, [])
    let newSubject = new BehaviorSubject<Comment[]>([])
    this.observersCommentsForDish.set(id, newSubject)

    this.loading$.next(true)
    this.getCommentsForDishFromDatabase(id).subscribe(
      next => {
        this.commentsForDish.set(id, next)
        newSubject.next(next)
        this.loading$.next(false)
      }
    )

    return newSubject.asObservable()
  }

  private getCommentsForDishFromDatabase( id : string ) : Observable<Comment[]>{
    return this.http.get<Comment[]>(this.api.COMMENTS_URL + `/product/${id}`)
  }

  updateCommentsForDish(id : string){
    if (!this.observersCommentsForDish.has(id))
      return

    // @ts-ignore
    this.observersCommentsForDish.get(id).next(this.commentsForDish.get(id))
  }

  async addCommentToDish(dishId : string, nick : string, name : string, body : string, date ?: string){
    let comment = {
        dishId: dishId,
        name: name,
        body: body,
        date: date
    }

    let headers = new HttpHeaders({'Content-Type':'application/json'})
    this.http.post<Comment>(this.api.COMMENTS_URL + `/product/${dishId}`, comment, {headers}).subscribe(
      savedComment => {
        if (!this.observersCommentsForDish.has(dishId)){
            this.commentsForDish.set(dishId, [savedComment])
            this.observersCommentsForDish.set(dishId, new BehaviorSubject<Comment[]>([savedComment]))
        } else {
          // @ts-ignore
          this.commentsForDish.get(dishId).push(savedComment)
          // @ts-ignore
          this.observersCommentsForDish.get(dishId).next(this.commentsForDish.get(dishId))
        }
      }
    )

  }
}
