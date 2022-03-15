export interface Dish {
  _id : string
  name : string
  cuisine : string
  type : string
  category : string
  ingredients ?: string
  maxServingAmount : number
  price: number
  description ?: string
  imageLink : string[]
  rating : number
  amountOfRatings : number
  selectedAmount : number
  userRating : number | null
}
