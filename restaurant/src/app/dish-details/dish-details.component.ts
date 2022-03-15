import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Dish} from "../dish";
import {DishesService} from "../services/dishes.service";
import {ActivatedRoute} from "@angular/router";
import {Comment} from "../comment";
import {CommentService} from "../services/comment.service";
import {Observable} from "rxjs";
import {UserService} from "../user.service";

@Component({
  selector: 'app-dish-details',
  templateUrl: './dish-details.component.html',
  styleUrls: ['./dish-details.component.css']
})
export class DishDetailsComponent implements OnInit, AfterViewChecked {

  id : string | null
  dish : Dish | null
  comments : Comment[] | null
  loading : boolean = true

  constructor(private dishService : DishesService, private commentService : CommentService, private route : ActivatedRoute, public user : UserService, private cd : ChangeDetectorRef) {
    this.id = null
    this.dish = null
    this.comments = null
    route.paramMap.subscribe( async params => {
      this.id = <string>params.get('id')
      dishService.getLocalDishObserverWithID(this.id).subscribe(next => {
        if (this.id === null)
          return
        this.dish = dishService.getLocalDishWithID(this.id)
        if (this.dish !== null)
          commentService.getCommentsForDish(this.dish._id).subscribe(
            next => this.comments = next
          )
      })

    })

    commentService.getLoading$().subscribe(
      next => this.loading = next
    )
  }

  ngOnInit(): void {
  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges()
  }

}
