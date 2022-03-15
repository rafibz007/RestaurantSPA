import {Injectable} from '@angular/core';
import {User} from "./user";
import {AuthService} from "./services/auth.service";
import {ApiConnectionService} from "./services/api-connection.service";
import {HttpClient} from "@angular/common/http";
import {Role} from "./role";
import {DishesService} from "./services/dishes.service";
import {Dish} from "./dish";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUser : User | null = null

  constructor(private auth : AuthService, private api : ApiConnectionService, private http : HttpClient, private dishService : DishesService) {
    auth.getLoggedUser$().subscribe(
      next => this.setUser(next)
    )
  }

  setUser(user:User|null){
    this.currentUser = user
  }

  isLoggedIn(){
    // console.log(this.auth.isLoggedIn())
    // console.log(this.currentUser !== null)
    // console.log(this.auth.isLoggedIn() && this.currentUser !== null)
    return this.auth.isLoggedIn() && this.currentUser !== null
  }

  hasOrderedDish(dish:Dish){
    // return this.currentUser?.orderHistory.has(dishId)
    return this.dishService.selectedDishes.has(dish)
  }

  async updateOrderHistory(){
    if (this.currentUser === null)
      return
    this.http.get<[{ dishId: string, amount: number, price: number, date: string }]>(this.api.HISTORY_URL + this.currentUser?._id).subscribe(
      next => {
        let orders = new Map()
        for (let position of next)
          orders.set(position.dishId, {amount:position.amount, price:position.price, date:new Date(position.date)})

        if (this.currentUser === null)
          return
        this.currentUser.orderHistory = orders
      }
    )
  }

  isAdmin(){
    return this.currentUser !== null ? this.currentUser.rolesIDs.includes(Role.ADMIN) : false
  }

  isManager(){
    return this.currentUser !== null ? this.currentUser.rolesIDs.includes(Role.MANAGER) : false
  }

  isClient(){
    return this.currentUser !== null ? this.currentUser.rolesIDs.includes(Role.CLIENT) : false
  }

  isBanned(){
    return this.currentUser !== null ? this.currentUser.isBanned : false
  }
}
