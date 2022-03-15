import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DishesService} from "../services/dishes.service";
import {Dish} from "../dish";

@Component({
  selector: 'app-remove-button',
  templateUrl: './remove-button.component.html',
  styleUrls: ['./remove-button.component.css']
})
export class RemoveButtonComponent implements OnInit {

  // @Input() counter !: number
  // @Output() counterChange = new EventEmitter<number>()
  @Input() dish !: Dish

  locked : boolean = false

  constructor(private dishService : DishesService) { }

  ngOnInit(): void {
  }

  lock() : void{
    this.locked = true
  }

  unlock() : void{
    this.locked = false
  }

  decrement() {
    if (this.locked)
      return

    this.dishService.decrementSelection(this.dish).then()
    // this.counter -= 1
    // this.counterChange.emit(this.counter)
  }

}
