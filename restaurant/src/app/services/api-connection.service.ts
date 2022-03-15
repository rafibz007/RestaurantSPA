import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiConnectionService {

  BASE_URL = "http://localhost:3000"
  PRODUCTS_URL = "http://localhost:3000/products"
  COMMENTS_URL = "http://localhost:3000/comments"
  HISTORY_URL = "http://localhost:3000/history"
  USER_URL = "http://localhost:3000/user"
  BASKET_URL = "http://localhost:3000/basket"
  RATING_URL = "http://localhost:3000/rating"

  constructor() { }
}
