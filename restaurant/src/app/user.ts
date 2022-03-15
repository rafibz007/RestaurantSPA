import {Role} from "./role";

export interface User {
  _id:string,
  username:string,
  email:string,
  rolesIDs:Array<Role>,
  isBanned:boolean,
  orderHistory:Map<string,{amount:number, price:number, date:Date}>
//  Map dishId -> amount, price, date
}
