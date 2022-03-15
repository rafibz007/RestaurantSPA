import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DishesService} from "../services/dishes.service";
import {Dish} from "../dish";

@Component({
  selector: 'app-add-button',
  templateUrl: './add-button.component.html',
  styleUrls: ['./add-button.component.css']
})
export class AddButtonComponent implements OnInit {

  // @Input() counter! : number
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

  increment(){
    if (this.locked)
      return

    this.dishService.incrementSelection(this.dish).then()
    // this.counter += 1
    // this.counterChange.emit(this.counter)
  }
}
