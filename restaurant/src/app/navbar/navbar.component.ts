import {Component, OnInit, OnChanges, AfterViewChecked, ChangeDetectorRef} from '@angular/core';
import {DishesService} from "../services/dishes.service";
import {Dish} from "../dish";
import {AuthService} from "../services/auth.service";
import {User} from "../user";
import {UserService} from "../user.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements AfterViewChecked {

  amount : number = 0
  selectedDishes : Set<Dish> = new Set<Dish>()
  private dishService : DishesService
  private cd : ChangeDetectorRef

  constructor(dishService : DishesService, cd : ChangeDetectorRef, public auth : AuthService, public user : UserService) {
    this.dishService = dishService
    this.cd = cd
    dishService.getSelectedDishes().subscribe( nextVal => this.selectedDishes = nextVal )
  }

  ngOnInit(): void {
  }

  ngAfterViewChecked() : void{
    let sum : number = 0
    for (let dish of this.selectedDishes){
      sum += dish.selectedAmount
    }
    this.amount = sum

    this.cd.detectChanges()
  }

}
