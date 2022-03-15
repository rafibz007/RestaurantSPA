import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DishesService} from "../services/dishes.service";
import {Dish} from "../dish";

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit, AfterViewChecked {

  selectedDishes : Array<Dish>
  sum : number = 0

  loading : boolean = true

  constructor(private dishService : DishesService, private cd : ChangeDetectorRef) {
    this.selectedDishes = []

    dishService.getLoading$().subscribe(
      next => {
        this.loading = next
      }
    )

    dishService.getSelectedDishes().subscribe(
      next => {
        this.selectedDishes = Array.from(next)
        this.calculateSum()
      }
    )
    this.calculateSum()
  }

  ngOnInit(): void {
  }

  ngAfterViewChecked() {
    this.calculateSum()
    this.cd.detectChanges()
  }

  calculateSum() : void{
    let sum = 0
    for (let dish of this.selectedDishes){
      sum += dish.price*dish.selectedAmount
    }
    this.sum = sum
  }
}
