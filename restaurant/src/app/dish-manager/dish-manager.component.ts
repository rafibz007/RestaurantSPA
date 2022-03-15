import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Dish} from "../dish";
import {DishesService} from "../services/dishes.service";

@Component({
  selector: 'app-dish-manager',
  templateUrl: './dish-manager.component.html',
  styleUrls: ['./dish-manager.component.css']
})
export class DishManagerComponent implements OnInit {

  loading : boolean = true
  dishesList : Array<Dish> = []

  constructor(public dishService : DishesService, private cd : ChangeDetectorRef) {
    dishService.getLoading$().subscribe(
      next => {
        this.loading = next
      }
    )

    dishService.getDishes().subscribe( next => {
      this.dishesList = next
    })
  }

  ngOnInit(): void {
  }


  removeDish(dish : Dish) : void{

    if (confirm("Are you sure you want to remove " + dish.name)){
      this.dishService.removeDish(dish._id)
      this.cd.detectChanges()
    }
  }


}
