import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  ViewChildren,
  Query,
  QueryList,
  AfterViewInit,
  ViewChild, AfterViewChecked, ChangeDetectorRef, SimpleChanges
} from '@angular/core';
import {Dish} from "../dish";
import {AddButtonComponent} from "../add-button/add-button.component";
import {RemoveButtonComponent} from "../remove-button/remove-button.component";
import {DishesService} from "../services/dishes.service";
import {BehaviorSubject} from "rxjs";
import {UserService} from "../user.service";

@Component({
  selector: 'app-dish',
  templateUrl: './dish.component.html',
  styleUrls: ['./dish.component.css']
})
export class DishComponent implements AfterViewChecked, OnChanges {
  @Input() isCheapest : boolean = false
  @Input() isMostExpensive : boolean = false

  @Input() dish : Dish | undefined
  @Output() dishChange = new EventEmitter<Dish>()




  constructor(private cd: ChangeDetectorRef, private dishService : DishesService, public user : UserService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.cd.detectChanges()
  }

  ngAfterViewChecked() {
    this.cd.detectChanges()
  }

  test(){
    console.log("dish")
    console.log(this.dish)
  }

}
