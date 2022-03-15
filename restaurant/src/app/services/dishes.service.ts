import {Injectable, OnInit} from '@angular/core';
import {Dish} from "../dish";
import {BehaviorSubject, firstValueFrom, lastValueFrom, map, Observable, Subject} from "rxjs";
import {Comment} from "../comment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ApiConnectionService} from "./api-connection.service";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class DishesService {

  allDishes : Dish[] = []
  observableAllDishes = new BehaviorSubject<Dish[]>(this.allDishes)
  loading$ = new BehaviorSubject<boolean>(true)

  dishObservers : Map<string, BehaviorSubject<Dish | null>> = new Map<string, BehaviorSubject<Dish | null>>()

  selectedDishes : Set<Dish> = new Set<Dish>()
  observableSelectedDishes = new BehaviorSubject<Set<Dish>> (this.selectedDishes)

  constructor(private http : HttpClient, private api : ApiConnectionService, private auth : AuthService) {
    this.auth.getSessionStatus$().subscribe(
      _ => {
          this.loading$.next(true)
          this.update()
        }
    )
    this.loading$.next(true)
    this.update()
  }

  update(){
    this.getAllDishes().subscribe(next => {
        this.updateServiceAndObservers(next)
      },
      error => {
        this.loading$.next(false)
      }
    )
  }

  private updateServiceAndObservers(nextAllDishes:Dish[]){
    this.allDishes = nextAllDishes
    this.selectedDishes.clear()
    for (let dish of this.allDishes)
      this.updateSelection(dish)
    this.observableSelectedDishes.next(this.selectedDishes)
    this.observableAllDishes.next(this.allDishes)
    this.updateObservedDishes()
    this.loading$.next(false)
  }


  private getAllDishes() : Observable<Dish[]>{
    return this.http.get<Dish[]>(this.api.PRODUCTS_URL, {withCredentials:true})
  }

  getLoading$(){
    return this.loading$.asObservable()
  }

  getSelectedDishes() : Observable<Set<Dish>> {
    return this.observableSelectedDishes.asObservable()
  }

  getDishes() : Observable<Dish[]>{
    return this.observableAllDishes.asObservable()
  }

  getDishesNames() : Set<string>{

    let result = new Set<string>()
    for (let dish of this.allDishes){
      result.add(dish.name)
    }
    return result
  }

  getDishesCuisines() : Set<string>{

    let result = new Set<string>()
    for (let dish of this.allDishes){
      result.add(dish.cuisine)
    }
    return result
  }

  getDishesTypes() : Set<string>{

    let result = new Set<string>()
    for (let dish of this.allDishes){
      result.add(dish.type)
    }
    return result
  }

  getDishesCategories() : Set<string>{

    let result = new Set<string>()
    for (let dish of this.allDishes){
      result.add(dish.category)
    }
    return result
  }

  getDishesMinMaxPrices() : { min: number, max: number }{

    if (this.allDishes.length === 0)
      return {min: 0, max:0}

    let _min = this.allDishes[0].price
    let _max = this.allDishes[0].price

    for (let dish of this.allDishes){
      _max = Math.max(_max, dish.price)
      _min = Math.min(_min, dish.price)
    }

    return {min: _min, max: _max}
  }

  getDishesMinMaxRatings() : { min: number, max: number }{

    if (this.allDishes.length === 0)
      return {min: 0, max:0}

    let _min = this.allDishes[0].rating
    let _max = this.allDishes[0].rating

    for (let dish of this.allDishes){
      _max = Math.max(_max, dish.rating)
      _min = Math.min(_min, dish.rating)
    }

    return {min: _min, max: _max}
  }

  removeDish(id : string) {
    this.http.delete(this.api.PRODUCTS_URL + `/${id}`).subscribe({
      next:(res)=>{
        for (let idx=0; idx < this.allDishes.length; idx++){
          if (this.allDishes[idx]._id === id){
            this.unselectDish(this.allDishes[idx]._id)
            this.allDishes.splice(idx, 1)
          }
        }
      }
    })

  }

  async addDish(name:string, cuisine:string, type:string, category:string,
          ingredients: string,
          maxServingAmount : number, price: number, description : string, imageLink : string[]){

    let dish = {
      name:name,
      cuisine:cuisine,
      type:type,
      category:category,
      ingredients:ingredients,
      maxServingAmount:Number(maxServingAmount),
      price:Number(price),
      description:description,
      imageLink:imageLink,
    }

    let headers = new HttpHeaders({"Content-Type": "application/json"})
    let newDish : Dish = await firstValueFrom(this.http.post<Dish>(this.api.PRODUCTS_URL,dish, {headers}))
    this.allDishes.push(newDish)
    this.observableAllDishes.next(this.allDishes)
  }

  selectDish(id : string){
    let dish = this.getLocalDishWithID(id)
    if (dish === null)
      return
    this.selectedDishes.add(dish)
    this.observableSelectedDishes.next(this.selectedDishes)
  }

  unselectDish(id : string){
    let dish = this.getLocalDishWithID(id)
    if (dish === null)
      return
    this.selectedDishes.delete(dish)
    this.observableSelectedDishes.next(this.selectedDishes)
  }


  addScore(score : number, dish : Dish){
    let headers = new HttpHeaders({'Content-Type':'application/json'})
    this.http.put<{ rated: boolean, userRating: number, rating:number, ratingsAmount:number}>
          (this.api.RATING_URL + `/${dish._id}`, {rating:score}, {headers}).subscribe({
      next:(res)=>{
          if (res.rated) {
            dish.userRating = res.userRating
            dish.rating = res.rating
            dish.amountOfRatings = res.ratingsAmount
          }
      }
    })
  }


  getLocalDishWithID(id : string) : Dish | null {
    for (let dish of this.allDishes){
      if (dish._id === id){
        return dish
      }
    }
    return null
  }

  getLocalDishObserverWithID(id : string) : Observable<Dish | null>{
    if (this.dishObservers.has(id))
    {// @ts-ignore
      return this.dishObservers.get(id).asObservable()
    }

    let dish = this.getLocalDishWithID(id)
    let subject = new BehaviorSubject<Dish | null>(dish)
    this.dishObservers.set(id, subject)
    return subject
  }

  async getDatabaseDishWithID(id : string) : Promise<Dish | null>{
    return await lastValueFrom(this.http.get<Dish>(this.api.PRODUCTS_URL + `/${id}`))
  }

  updateSelection(dish : Dish){
    if (dish.selectedAmount > 0)
      this.selectDish(dish._id)
    else
      this.unselectDish(dish._id)
  }

  async incrementSelection(dish:Dish){
    dish.selectedAmount += 1
    await this.synchronizeSelectionWithDatabase(dish)
  }

  async decrementSelection(dish:Dish){
    dish.selectedAmount -= 1
    await this.synchronizeSelectionWithDatabase(dish)
  }

  async synchronizeSelectionWithDatabase(dish : Dish){
    const selected = dish.selectedAmount
    this.http.put<{dishId:string, amount:number, maxServingAmount:number}>(this.api.BASKET_URL, {dishId:dish._id, amount:selected}).subscribe(
      {
        next: (res) => {
          if (res.amount !== selected) {
            dish.selectedAmount = res.amount
            dish.maxServingAmount = res.maxServingAmount
            this.updateSelection(dish)
          }
        },
      }
    )
  }

  updateObservedDishes(){
    for (let dish of this.allDishes){
      if (this.dishObservers.has(dish._id))
        { // @ts-ignore
          this.dishObservers.get(dish._id).next(dish)
        }
    }
  }

}
