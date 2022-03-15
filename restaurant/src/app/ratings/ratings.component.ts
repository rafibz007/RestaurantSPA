import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Dish} from "../dish";
import {Observable} from "rxjs";
import {DishesService} from "../services/dishes.service";

@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.css']
})
export class RatingsComponent implements OnInit {

  @Input() dish !: Dish

  constructor(public dishService : DishesService) {

  }

  ngOnInit(): void {

  }

  updateScore(score : number) : void{
    this.dishService.addScore(score, this.dish)
  }

}
